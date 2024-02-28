from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from .schemas import BidOrderPostCreate, BidOrderPost
from .services import (
    create_bid_order_post,
    get_all_bid_order_posts,
    update_bid_order_post,
    delete_bid_order_post,
    get_bid_order_post_by_id,
)
from auth.services import get_current_user

router = APIRouter()

@router.post("/bid-order-posts/", response_model=BidOrderPost, tags=["Bid Order Posts"], summary="Create a Bid Order Post", description="Create a new Bid Order Post")
async def add_bid_order_post(bid_order_post_data: BidOrderPostCreate, current_user: str = Depends(get_current_user)):
    return create_bid_order_post(bid_order_post_data)

@router.get("/bid-order-posts/", response_model=List[BidOrderPost], tags=["Bid Order Posts"], summary="Get All Bid Order Posts", description="Get all Bid Order Posts")
async def list_bid_order_posts(current_user: str = Depends(get_current_user)):
    return get_all_bid_order_posts()

@router.put("/bid-order-posts/{order_post_id}", tags=["Bid Order Posts"], summary="Update a Bid Order Post", description="Update an existing Bid Order Post")
async def edit_bid_order_post(order_post_id: int, bid_order_post_data: BidOrderPostCreate, current_user: str = Depends(get_current_user)):
    updated_post = update_bid_order_post(order_post_id, bid_order_post_data)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Bid Order Post not found")
    return updated_post

@router.delete("/bid-order-posts/{order_post_id}", tags=["Bid Order Posts"], summary="Delete a Bid Order Post", description="Delete a Bid Order Post")
async def remove_bid_order_post(order_post_id: int, current_user: str = Depends(get_current_user)):
    deleted = delete_bid_order_post(order_post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Bid Order Post not found")
    return {"message": "Bid Order Post deleted successfully"}

@router.get("/bid-order-posts/{order_post_id}", response_model=BidOrderPost, tags=["Bid Order Posts"], summary="Get Bid Order Post by ID", description="Get a Bid Order Post by ID")
async def get_bid_order_post_by_id_api(order_post_id: int, current_user: str = Depends(get_current_user)):
    bid_order_post = get_bid_order_post_by_id(order_post_id)
    if not bid_order_post:
        raise HTTPException(status_code=404, detail="Bid Order Post not found")
    return bid_order_post
