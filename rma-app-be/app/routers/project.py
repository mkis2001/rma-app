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
from app.database import get_db
from app.db.artist import Artist
from app.db.project import Project
from app.db.project_type import ProjectType
from app.db.song import (
    Song,  # noqa: F401 - required for SQLAlchemy to resolve relationship
)

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    """Endpoint for getting all projects."""

    projects = db.scalars(select(Project)).all()

    return projects


@router.get(
    "/short", status_code=status.HTTP_200_OK, response_model=list[ProjectResponseShort]
)
def get_projects_short(db: Session = Depends(get_db)):
    """Endpoint for getting all projects."""

    projects = db.scalars(select(Project)).all()

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
def get_project_songs(project_id: int, db: Session = Depends(get_db)):
    """Endpoint for getting a project details with it's songs."""

    songs = db.scalars(select(Song).where(Song.project_id == project_id)).all()

    return songs


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=ProjectResponse,
)
def create_project(project: ProjectCreateRequest, db: Session = Depends(get_db)):
    """Endpoint for creating a new project."""

    if not db.get(ProjectType, project.type_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project type with given id doesn't exist.",
        )

    if not db.get(Artist, project.artist_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist with given id doesn't exist.",
        )

    db_project = Project(**project.model_dump(exclude_none=True))

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project
