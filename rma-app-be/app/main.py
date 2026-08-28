from fastapi import FastAPI

import app.db.user  # noqa: F401 — must be imported before Artist mapper initializes
import app.db.user_artist  # noqa: F401 — must be imported before Artist/User mappers initialize
from app.routers.artist import router as artists_router
from app.routers.project import router as projects_router
from app.routers.song import router as songs_router
from app.routers.song_file import router as song_files_router
from app.routers.user import router as users_router

app = FastAPI()

app.include_router(projects_router)
app.include_router(songs_router)
app.include_router(song_files_router)
app.include_router(artists_router)
app.include_router(users_router)


@app.get("/")
def read_root():
    return {"Helo": "World"}
