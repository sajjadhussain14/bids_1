from typing import List, Optional
from fastapi import HTTPException
from db.connection import get_db_connection
from .schemas import BidClarificationCreate, BidClarification
from datetime import date

# Create a Bid Clarification
def create_bid_clarification(bid_clarification_data: BidClarificationCreate) -> BidClarification:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO bid_clarification (
        rfx_id, submitted_to, assigned_to, title, type, issued_date, due_date, status,
        reference_num, completed, completed_date
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *;
    """

    values = (
        bid_clarification_data.rfx_id,
        bid_clarification_data.submitted_to,
        bid_clarification_data.assigned_to,
        bid_clarification_data.title,
        bid_clarification_data.type,
        bid_clarification_data.issued_date,
        bid_clarification_data.due_date,
        bid_clarification_data.status,
        bid_clarification_data.reference_num,
        bid_clarification_data.completed,
        bid_clarification_data.completed_date
    )

    cursor.execute(query, values)
    new_bid_clarification = cursor.fetchone()

    conn.commit()
    conn.close()

    if new_bid_clarification:
        return BidClarification(
            bid_clarification_id=new_bid_clarification[0],
            rfx_id=new_bid_clarification[1],
            submitted_to=new_bid_clarification[2],
            assigned_to=new_bid_clarification[3],
            title=new_bid_clarification[4],
            type=new_bid_clarification[5],
            issued_date=new_bid_clarification[6],
            due_date=new_bid_clarification[7],
            status=new_bid_clarification[8],
            reference_num=new_bid_clarification[9],
            completed=new_bid_clarification[10],
            completed_date=new_bid_clarification[11]
        )
    else:
        raise HTTPException(status_code=404, detail="Bid Clarification creation failed")

# Get all Bid Clarifications
def get_all_bid_clarifications(rfx_id: int) -> List[BidClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM bid_clarification WHERE rfx_id = %s;"
    cursor.execute(query, (rfx_id,))
    bid_clarifications = cursor.fetchall()

    conn.close()

    return [
        BidClarification(
            bid_clarification_id=row[0],
            rfx_id=row[1],
            submitted_to=row[2],
            assigned_to=row[3],
            title=row[4],
            type=row[5],
            issued_date=row[6],
            due_date=row[7],
            status=row[8],
            reference_num=row[9],
            completed=row[10],
            completed_date=row[11]
        )
        for row in bid_clarifications
    ]

# Update Bid Clarification by ID
def update_bid_clarification(bid_clarification_id: int, bid_clarification_data: BidClarificationCreate) -> Optional[BidClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE bid_clarification SET 
        rfx_id = %s,
        submitted_to = %s,
        assigned_to = %s,
        title = %s,
        type = %s,
        issued_date = %s,
        due_date = %s,
        status = %s,
        reference_num = %s,
        completed = %s,
        completed_date = %s
    WHERE bid_clarification_id = %s RETURNING *;
    """

    values = (
        bid_clarification_data.rfx_id,
        bid_clarification_data.submitted_to,
        bid_clarification_data.assigned_to,
        bid_clarification_data.title,
        bid_clarification_data.type,
        bid_clarification_data.issued_date,
        bid_clarification_data.due_date,
        bid_clarification_data.status,
        bid_clarification_data.reference_num,
        bid_clarification_data.completed,
        bid_clarification_data.completed_date,
        bid_clarification_id
    )

    cursor.execute(query, values)
    updated_bid_clarification = cursor.fetchone()

    conn.commit()
    conn.close()

    if updated_bid_clarification:
        return BidClarification(
            bid_clarification_id=updated_bid_clarification[0],
            rfx_id=updated_bid_clarification[1],
            submitted_to=updated_bid_clarification[2],
            assigned_to=updated_bid_clarification[3],
            title=updated_bid_clarification[4],
            type=updated_bid_clarification[5],
            issued_date=updated_bid_clarification[6],
            due_date=updated_bid_clarification[7],
            status=updated_bid_clarification[8],
            reference_num=updated_bid_clarification[9],
            completed=updated_bid_clarification[10],
            completed_date=updated_bid_clarification[11]
        )
    else:
        return None

# Delete Bid Clarification by ID
def delete_bid_clarification(bid_clarification_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "DELETE FROM bid_clarification WHERE bid_clarification_id = %s RETURNING bid_clarification_id;"
    cursor.execute(query, (bid_clarification_id,))
    deleted_bid_clarification = cursor.fetchone()

    conn.commit()
    conn.close()

    if deleted_bid_clarification:
        return True
    else:
        return False

# Get Bid Clarification by ID
def get_bid_clarification_by_id(bid_clarification_id: int) -> Optional[BidClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM bid_clarification WHERE bid_clarification_id = %s;"
    cursor.execute(query, (bid_clarification_id,))
    bid_clarification = cursor.fetchone()

    conn.close()

    if bid_clarification:
        return BidClarification(
            bid_clarification_id=bid_clarification[0],
            rfx_id=bid_clarification[1],
            submitted_to=bid_clarification[2],
            assigned_to=bid_clarification[3],
            title=bid_clarification[4],
            type=bid_clarification[5],
            issued_date=bid_clarification[6],
            due_date=bid_clarification[7],
            status=bid_clarification[8],
            reference_num=bid_clarification[9],
            completed=bid_clarification[10],
            completed_date=bid_clarification[11]
        )
    else:
        return None

# Get Bid Clarification by title
def get_bid_clarification_by_title(rfx_id: int, title: str) -> Optional[BidClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM bid_clarification WHERE rfx_id = %s AND title = %s;"
    cursor.execute(query, (rfx_id, title))
    bid_clarification = cursor.fetchone()

    conn.close()

    if bid_clarification:
        return BidClarification(
            bid_clarification_id=bid_clarification[0],
            rfx_id=bid_clarification[1],
            submitted_to=bid_clarification[2],
            assigned_to=bid_clarification[3],
            title=bid_clarification[4],
            type=bid_clarification[5],
            issued_date=bid_clarification[6],
            due_date=bid_clarification[7],
            status=bid_clarification[8],
            reference_num=bid_clarification[9],
            completed=bid_clarification[10],
            completed_date=bid_clarification[11]
        )
    else:
        return None
    
# Get Bid Clarification by status
def get_bid_clarification_by_title(rfx_id: int, status: str) -> List[BidClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM bid_clarification WHERE rfx_id = %s AND status = %s;"
    cursor.execute(query, (rfx_id, status))
    bid_clarification = cursor.fetchall()

    conn.close()

    return [
        BidClarification(
            bid_clarification_id=row[0],
            rfx_id=row[1],
            submitted_to=row[2],
            assigned_to=row[3],
            title=row[4],
            type=row[5],
            issued_date=row[6],
            due_date=row[7],
            status=row[8],
            reference_num=row[9],
            completed=row[10],
            completed_date=row[11]
        )
        for row in bid_clarification
    ]
