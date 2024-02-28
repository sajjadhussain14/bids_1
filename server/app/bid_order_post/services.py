from typing import List, Optional
from fastapi import HTTPException
from db.connection import get_db_connection
from datetime import date
from .schemas import BidOrderPostCreate, BidOrderPost

# Create a Bid Order Post
def create_bid_order_post(bid_order_post_data: BidOrderPostCreate) -> BidOrderPost:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO bid_order_post (rfx_id, bid_order_id, post_by, comment, post_on)
    VALUES (%s, %s, %s, %s, %s) RETURNING *;
    """

    values = (
        bid_order_post_data.rfx_id,
        bid_order_post_data.bid_order_id,
        bid_order_post_data.post_by,
        bid_order_post_data.comment,
        bid_order_post_data.post_on,
    )

    cursor.execute(query, values)
    new_bid_order_post = cursor.fetchone()

    conn.commit()
    conn.close()

    if new_bid_order_post:
        return BidOrderPost(
            order_post_id=new_bid_order_post[0],
            rfx_id=new_bid_order_post[1],
            bid_order_id=new_bid_order_post[2],
            post_by=new_bid_order_post[3],
            comment=new_bid_order_post[4],
            post_on=new_bid_order_post[5],
        )
    else:
        raise HTTPException(status_code=404, detail="Bid Order Post creation failed")

# Get all Bid Order Posts
def get_all_bid_order_posts() -> List[BidOrderPost]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM bid_order_post;"
    cursor.execute(query)
    bid_order_posts = cursor.fetchall()

    conn.close()

    return [
        BidOrderPost(
            order_post_id=row[0],
            rfx_id=row[1],
            bid_order_id=row[2],
            post_by=row[3],
            comment=row[4],
            post_on=row[5],
        )
        for row in bid_order_posts
    ]

# Delete Bid Order Post by ID
def delete_bid_order_post(order_post_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "DELETE FROM bid_order_post WHERE order_post_id = %s RETURNING *;"
    cursor.execute(query, (order_post_id,))
    deleted_bid_order_post = cursor.fetchone()

    conn.commit()
    conn.close()

    if deleted_bid_order_post:
        return True
    else:
        return False

# Get Bid Order Post by ID
def get_bid_order_post_by_id(order_post_id: int) -> Optional[BidOrderPost]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM bid_order_post WHERE order_post_id = %s;"
    cursor.execute(query, (order_post_id,))
    bid_order_post = cursor.fetchone()

    conn.close()

    if bid_order_post:
        return BidOrderPost(
            order_post_id=bid_order_post[0],
            rfx_id=bid_order_post[1],
            bid_order_id=bid_order_post[2],
            post_by=bid_order_post[3],
            comment=bid_order_post[4],
            post_on=bid_order_post[5],
        )
    else:
        return None

# Update Bid Order Post by ID
def update_bid_order_post(order_post_id: int, new_data: BidOrderPostCreate) -> Optional[BidOrderPost]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE bid_order_post
    SET rfx_id = %s, bid_order_id = %s, post_by = %s, comment = %s, post_on = %s
    WHERE order_post_id = %s RETURNING *;
    """

    values = (
        new_data.rfx_id,
        new_data.bid_order_id,
        new_data.post_by,
        new_data.comment,
        new_data.post_on,
        order_post_id
    )

    cursor.execute(query, values)
    updated_bid_order_post = cursor.fetchone()

    conn.commit()
    conn.close()

    if updated_bid_order_post:
        return BidOrderPost(
            order_post_id=updated_bid_order_post[0],
            rfx_id=updated_bid_order_post[1],
            bid_order_id=updated_bid_order_post[2],
            post_by=updated_bid_order_post[3],
            comment=updated_bid_order_post[4],
            post_on=updated_bid_order_post[5],
        )
    else:
        return None
