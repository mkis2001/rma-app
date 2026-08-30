from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.project import (
    ProjectCreateRequest,
    ProjectResponse,
    ProjectResponseShort,
    ProjectTypeResponse,
    ProjectUpdateRequest,
)
from app.api_models.song import SongShortResponse
from app.auth import get_current_user
from app.constants import PROJECT_IMAGE_BUCKET_NAME
from app.database import get_db
from app.db.artist import Artist
from app.db.project import Project
from app.db.project_type import ProjectType
from app.db.song import (
    Song,  # noqa: F401 - required for SQLAlchemy to resolve relationship
)
from app.db.user import User
from app.db.user_artist import UserArtist
from app.storage import supabase

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Endpoint for getting all projects belonging to the current user."""

    projects = db.scalars(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id)
    ).all()

    return projects


@router.get("/short", status_code=status.HTTP_200_OK, response_model=list[ProjectResponseShort])
def get_projects_short(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Endpoint for getting all projects belonging to the current user."""

    projects = db.scalars(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id)
    ).all()

    return projects


@router.get(
    "/types",
    status_code=status.HTTP_200_OK,
    response_model=list[ProjectTypeResponse],
)
def get_project_types(db: Session = Depends(get_db)):
    """Endpoint for getting all project types."""

    project_types = db.scalars(select(ProjectType)).all()

    return project_types


@router.get(
    "/{project_id}/songs",
    status_code=status.HTTP_200_OK,
    response_model=list[SongShortResponse],
)
def get_project_songs(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for getting a project's songs (only if user owns the project)."""

    project = db.scalar(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Project.id == project_id)
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    songs = db.scalars(select(Song).where(Song.project_id == project_id)).all()

    return songs


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=ProjectResponse,
)
def create_project(
    project: ProjectCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for creating a new project."""

    if not db.get(ProjectType, project.type_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project type with given ID not found.",
        )

    artist = db.scalar(
        select(Artist)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Artist.id == project.artist_id)
    )

    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist with given ID not found.",
        )

    db_project = Project(**project.model_dump(exclude_none=True))

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project


@router.patch(
    "/{project_id}",
    status_code=status.HTTP_200_OK,
    response_model=ProjectResponse,
)
def update_project(
    project_id: int,
    project_update: ProjectUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for updating a project (partial update, only owned projects)."""

    project = db.scalar(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Project.id == project_id)
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    update_data = project_update.model_dump(exclude_unset=True)

    if "type_id" in update_data and not db.get(ProjectType, update_data["type_id"]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project type with given ID not found.",
        )

    if "artist_id" in update_data:
        artist = db.scalar(
            select(Artist)
            .join(UserArtist, UserArtist.artist_id == Artist.id)
            .where(UserArtist.user_id == user.id, Artist.id == update_data["artist_id"])
        )

        if not artist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Artist with given ID not found.",
            )

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


@router.post(
    "/{project_id}/image",
    status_code=status.HTTP_200_OK,
    response_model=ProjectResponse,
)
async def upload_project_image(
    project_id: int,
    file: UploadFile,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for uploading a cover image for a project."""

    project = db.scalar(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Project.id == project_id)
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    # Delete existing image if one exists
    if project.image_path:
        try:
            supabase.storage.from_(PROJECT_IMAGE_BUCKET_NAME).remove([project.image_path])
        except Exception:
            pass

    content = await file.read()
    storage_path = f"projects/{project_id}/{file.filename}"

    try:
        supabase.storage.from_(PROJECT_IMAGE_BUCKET_NAME).upload(
            storage_path,
            content,
            {"content-type": file.content_type},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {e}",
        )

    project.image_path = storage_path
    db.commit()
    db.refresh(project)

    return project


@router.get("/{project_id}/image", status_code=status.HTTP_200_OK)
def get_project_image(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for downloading a project's cover image."""

    project = db.scalar(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Project.id == project_id)
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    if not project.image_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project has no image.",
        )

    try:
        data = supabase.storage.from_(PROJECT_IMAGE_BUCKET_NAME).download(project.image_path)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to download image: {e}",
        )

    # Infer content type from the stored path extension
    content_type = "image/jpeg"
    if project.image_path.endswith(".png"):
        content_type = "image/png"
    elif project.image_path.endswith(".webp"):
        content_type = "image/webp"

    return Response(content=data, media_type=content_type)


@router.delete(
    "/{project_id}/image",
    status_code=status.HTTP_200_OK,
    response_model=ProjectResponse,
)
def delete_project_image(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for removing a project's cover image."""

    project = db.scalar(
        select(Project)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Project.id == project_id)
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    if not project.image_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project has no image.",
        )

    try:
        supabase.storage.from_(PROJECT_IMAGE_BUCKET_NAME).remove([project.image_path])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete image: {e}",
        )

    project.image_path = None
    db.commit()
    db.refresh(project)

    return project
