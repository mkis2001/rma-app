from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api_models.artist import (
    ArtistAddUserRequest,
    ArtistCreateRequest,
    ArtistResponse,
    ArtistShortResponse,
)
from app.auth import get_current_user
from app.database import get_db
from app.db.artist import Artist
from app.db.user import User
from app.db.user_artist import UserArtist

router = APIRouter(prefix="/artists", tags=["artists"])


@router.get("/short", response_model=list[ArtistShortResponse])
def get_artists_short(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Endpoint for getting all artists belonging to the current user."""

    artists = db.scalars(
        select(Artist)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id)
    ).all()

    return artists


@router.get("/", response_model=list[ArtistResponse])
def get_artists(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Endpoint for getting all artists belonging to the current user."""

    artists = db.scalars(
        select(Artist)
        .join(UserArtist, UserArtist.artist_id == Artist.id)
        .where(UserArtist.user_id == user.id)
    ).all()

    return artists


@router.get("/{artist_id}", response_model=ArtistResponse)
def get_artist(
    artist_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for getting a specific artist by id belonging to the current user."""

    artist = db.scalars(
        select(Artist).join(UserArtist).where(Artist.id == artist_id, UserArtist.user_id == user.id)
    ).first()

    return artist


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ArtistResponse)
def create_artist(
    request: ArtistCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for creating a new artist. The current user is automatically added as a member."""

    artist = Artist(
        name=request.name,
        description=request.description,
    )
    db.add(artist)
    db.flush()

    association = UserArtist(user_id=user.id, artist_id=artist.id)
    db.add(association)
    db.commit()
    db.refresh(artist)

    return artist


@router.patch("/{artist_id}/users", status_code=status.HTTP_200_OK, response_model=ArtistResponse)
def add_user_to_artist(
    artist_id: int,
    request: ArtistAddUserRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for adding the current user to an artist."""

    user_auth = db.scalars(
        select(User)
        .join(UserArtist)
        .where(UserArtist.user_id == user.id, UserArtist.artist_id == artist_id)
    ).first()

    if not user_auth:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to add users to this artist.",
        )

    artist = db.get(Artist, artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist with given ID not found.",
        )

    existing_association = db.scalars(
        select(UserArtist).where(
            UserArtist.user_id == request.user_id, UserArtist.artist_id == artist.id
        )
    ).first()

    if existing_association:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already associated with this artist.",
        )

    new_association = UserArtist(user_id=request.user_id, artist_id=artist.id)
    db.add(new_association)
    db.commit()
    db.refresh(artist)

    return artist


@router.delete(
    "/{artist_id}/users/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=ArtistResponse,
)
def remove_user_from_artist(
    artist_id: int,
    user_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Endpoint for removing a user from an artist."""

    user_auth = db.scalars(
        select(User)
        .join(UserArtist)
        .where(UserArtist.user_id == user.id, UserArtist.artist_id == artist_id)
    ).first()

    if not user_auth:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to remove users from this artist.",
        )

    artist = db.get(Artist, artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist with given ID not found.",
        )

    association = db.scalars(
        select(UserArtist).where(UserArtist.user_id == user_id, UserArtist.artist_id == artist_id)
    ).first()

    if not association:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not associated with this artist.",
        )

    db.delete(association)
    db.commit()
    db.refresh(artist)

    return artist
