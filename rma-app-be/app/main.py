from fastapi import FastAPI

from app.routers.artist import router as artists_router
from app.routers.project import router as projects_router
from app.routers.song import router as songs_router

app = FastAPI()

app.include_router(projects_router)
app.include_router(songs_router)
app.include_router(artists_router)


@app.get("/")
def read_root():
    return {"Helo": "World"}
