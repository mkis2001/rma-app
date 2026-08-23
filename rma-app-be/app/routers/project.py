from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.project import (
    ProjectCreateRequest,
    ProjectResponse,
    ProjectResponseShort,
    ProjectTypeResponse,
)
from app.api_models.song import SongShortResponse
from app.auth import get_current_user
from app.database import get_db
from app.db.artist import Artist
from app.db.project import Project
from app.db.project_type import ProjectType
from app.db.song import (
    Song,  # noqa: F401 - required for SQLAlchemy to resolve relationship
)
from app.db.user import User
from app.db.user_artist import UserArtist

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


@router.get(
    "/short", status_code=status.HTTP_200_OK, response_model=list[ProjectResponseShort]
)
def get_projects_short(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
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
