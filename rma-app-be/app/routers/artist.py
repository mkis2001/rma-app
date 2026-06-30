from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.artist import ArtistResponse, ArtistShortResponse
from app.database import get_db
from app.db.artist import Artist

router = APIRouter(prefix="/artists", tags=["artists"])


@router.get("/short", response_model=list[ArtistShortResponse])
def get_artists_short(db: Session = Depends(get_db)):
    """Endpoint for getting all artists in short format."""

    artists = db.scalars(select(Artist)).all()

    return artists


@router.get("/", response_model=list[ArtistResponse])
def get_artists(db: Session = Depends(get_db)):
    """Endpoint for getting all artists."""

    artists = db.scalars(select(Artist)).all()

    return artists
