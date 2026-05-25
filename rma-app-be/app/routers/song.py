from fastapi import APIRouter

router = APIRouter(prefix="/song", tags=["song"])

@router.get("/")
def get_songs():
    return {"Hello": "song"}