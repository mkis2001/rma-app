from fastapi import FastAPI

from app.routers.project import router as project_router
from app.routers.song import router as song_router

app = FastAPI()

app.include_router(project_router)
app.include_router(song_router)

@app.get("/")
def read_root():
    return {"Helo": "World"}
