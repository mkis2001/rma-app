from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.song import SongCreateRequest, SongResponse, SongUpdateRequest
from app.auth import get_current_user
from app.database import get_db
from app.db.artist import Artist
from app.db.project import Project
from app.db.song import Song
from app.db.user import User
from app.db.user_artist import UserArtist

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[SongResponse])
def get_songs(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    project_id: int | None = Query(
        default=None, description="Filter songs by project id."
    ),
):
    """Endpoint for getting all songs owned by the user, optionally filtered by project."""

    query = (
        select(Song)
        .join(Project, Song.project_id == Project.id)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id)
    )

    if project_id is not None:
        query = query.where(Song.project_id == project_id)

    songs = db.scalars(query).all()

    return songs


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=SongResponse)
def create_song(song: SongCreateRequest, db: Session = Depends(get_db)):
    """Endpoint for creating a new song."""

    if not db.get(Project, song.project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project with given id doesn't exist.",
        )

    db_song = Song(**song.model_dump(exclude_none=True))

    db.add(db_song)
    db.commit()
    db.refresh(db_song)

    return db_song


@router.patch("/{song_id}", status_code=status.HTTP_200_OK, response_model=SongResponse)
def update_song(
    song_id: int,
    song_update: SongUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for updating a song (partial update, only songs the user owns)."""

    song = db.scalar(
        select(Song)
        .join(Project, Song.project_id == Project.id)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id, Song.id == song_id)
    )

    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found.",
        )

    update_data = song_update.model_dump(exclude_unset=True)

    if "project_id" in update_data:
        project = db.scalar(
            select(Project)
            .join(Artist, Project.artist_id == Artist.id)
            .join(UserArtist, UserArtist.artist_id == Artist.id)
            .where(UserArtist.user_id == user.id, Project.id == update_data["project_id"])
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project with given id doesn't exist.",
            )

    for field, value in update_data.items():
        setattr(song, field, value)

    db.commit()
    db.refresh(song)

    return song
