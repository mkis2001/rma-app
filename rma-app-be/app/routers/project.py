from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.project import ProjectResponse
from app.database import get_db
from app.db.project import Project

router = APIRouter(prefix="/project", tags=["project"])


@router.get("/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    """Endpoint for getting all projects."""

    projects = db.scalars(select(Project)).all()
    return projects
