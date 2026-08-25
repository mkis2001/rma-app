from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.song_file import SongFileResponse
from app.auth import get_current_user
from app.constants import SONG_FILES_BUCKET_NAME
from app.database import get_db
from app.db.artist import Artist
from app.db.project import Project
from app.db.song import Song
from app.db.song_file import SongFile
from app.db.user import User
from app.db.user_artist import UserArtist
from app.storage import supabase

router = APIRouter(prefix="/songs/{song_id}/files", tags=["song-files"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[SongFileResponse])
def get_song_files(
    song_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for getting all files belonging to a song."""

    song = db.scalar(
        select(Song)
        .join(Project, Song.project_id == Project.id)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(Song.id == song_id, UserArtist.user_id == user.id)
    )

    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found.",
        )

    files = db.scalars(select(SongFile).where(SongFile.song_id == song_id)).all()

    return files


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=SongFileResponse)
async def upload_song_file(
    song_id: int,
    file: UploadFile,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for uploading a file to a song."""

    song = db.scalar(
        select(Song)
        .join(Project, Song.project_id == Project.id)
        .join(Artist, Project.artist_id == Artist.id)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(Song.id == song_id, UserArtist.user_id == user.id)
    )

    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found.",
        )

    content = await file.read()
    storage_path = f"songs/{song_id}/{file.filename}"

    try:
        supabase.storage.from_(SONG_FILES_BUCKET_NAME).upload(
            storage_path,
            content,
            {"content-type": file.content_type},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {e}",
        )

    db_file = SongFile(
        name=file.filename,
        song_id=song_id,
        path=storage_path,
        mime_type=file.content_type,
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file
