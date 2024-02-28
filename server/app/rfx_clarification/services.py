from typing import Optional, List
from fastapi import HTTPException
from db.connection import get_db_connection
from rfx_clarification.schemas import RfxClarificationCreate, RfxClarification
from datetime import date



### methods clarification

def create_rfx_clarification(clarification_data: RfxClarificationCreate) -> RfxClarification:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO rfx_clarification (
        rfx_id, submitted_by, assign_to, rfx_clarification_ref_num,
        clarification_title, clarification_type, clarification_issued_date,
        clarification_due_date, status
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *;
    """

    values = (
        clarification_data.rfx_id,
        clarification_data.submitted_by,
        clarification_data.assign_to,
        clarification_data.rfx_clarification_ref_num,
        clarification_data.clarification_title,
        clarification_data.clarification_type,
        clarification_data.clarification_issued_date,
        clarification_data.clarification_due_date,
        clarification_data.status
    )

    cursor.execute(query, values)
    new_clarification = cursor.fetchone()

    conn.commit()
    conn.close()

    if new_clarification:
        excluded_fields = {'null'}
        return RfxClarification(
            rfx_clarification_id=new_clarification[0],
            #**clarification_data.dict()            
            **{key: value for key, value in clarification_data.__dict__.items() if key not in excluded_fields}
        )
    else:
        raise HTTPException(status_code=404, detail="Clarification creation failed")


def get_rfx_clarifications(rfx_id: int) -> List[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM rfx_clarification WHERE rfx_id = %s;"
    cursor.execute(query,(rfx_id,))
    clarifications = cursor.fetchall()

    conn.close()

    return [
        RfxClarification(
            rfx_clarification_id=row[0],
            rfx_id=row[1],
            submitted_by=row[2],
            assign_to=row[3],
            rfx_clarification_ref_num=row[4],
            clarification_title=row[5],
            clarification_type=row[6],
            clarification_issued_date=row[7],
            clarification_due_date=row[8],
            status=row[9]
        )
        for row in clarifications
    ]


def get_rfx_clarification_by_id(clarification_id: int) -> Optional[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM rfx_clarification WHERE rfx_clarification_id = %s;"
    cursor.execute(query, (clarification_id,))
    clarification = cursor.fetchone()

    conn.close()

    if clarification:
        return RfxClarification(
            rfx_clarification_id=clarification[0],
            rfx_id=clarification[1],
            submitted_by=clarification[2],
            assign_to=clarification[3],
            rfx_clarification_ref_num=clarification[4],
            clarification_title=clarification[5],
            clarification_type=clarification[6],
            clarification_issued_date=clarification[7],
            clarification_due_date=clarification[8],
            status=clarification[9]
        )
    else:
        return None


def update_rfx_clarification(clarification_id: int, clarification_data: RfxClarificationCreate) -> Optional[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        UPDATE rfx_clarification SET 
            submitted_by = %s,
            assign_to = %s,
            rfx_clarification_ref_num = %s,
            clarification_title = %s,
            clarification_type = %s,
            clarification_issued_date = %s,
            clarification_due_date = %s,
            status = %s
        WHERE rfx_clarification_id = %s 
        RETURNING *;
        """

    values = (
        clarification_data.submitted_by,
        clarification_data.assign_to,
        clarification_data.rfx_clarification_ref_num,
        clarification_data.clarification_title,
        clarification_data.clarification_type,
        clarification_data.clarification_issued_date,
        clarification_data.clarification_due_date,
        clarification_data.status,
        clarification_id
    )

    cursor.execute(query, values)
    updated_clarification = cursor.fetchone()

    conn.commit()
    conn.close()

    if updated_clarification:
        excluded_fields = {'null'}
        return RfxClarification(
            rfx_clarification_id=updated_clarification[0],
            #**clarification_data.dict()
            **{key: value for key, value in clarification_data.__dict__.items() if key not in excluded_fields}
        )
    else:
        return None


def delete_rfx_clarification(clarification_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "DELETE FROM rfx_clarification_post WHERE rfx_clarification_id = %s RETURNING rfx_clarification_id;"
        cursor.execute(query, (clarification_id,))
        deleted_clarification_post = cursor.fetchone()
        
        query = "DELETE FROM rfx_clarification_meta WHERE rfx_clarification_id = %s RETURNING rfx_clarification_id;"
        cursor.execute(query, (clarification_id,))
        deleted_clarification_post = cursor.fetchone()
    except:
        None
        
    query = "DELETE FROM rfx_clarification WHERE rfx_clarification_id = %s RETURNING rfx_clarification_id;"
    cursor.execute(query, (clarification_id,))
    deleted_clarification = cursor.fetchone()

    conn.commit()
    conn.close()

    if deleted_clarification:
        return True
    else:
        return False
    
def get_rfx_clarification_by_type(clarification_type: str) -> List[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM rfx_clarification WHERE lower(clarification_type) = %s;"
    cursor.execute(query, (clarification_type.lower(),))
    clarifications = cursor.fetchall()

    conn.close()

    return [
        RfxClarification(
            rfx_clarification_id=row[0],
            rfx_id=row[1],
            submitted_by=row[2],
            assign_to=row[3],
            rfx_clarification_ref_num=row[4],
            clarification_title=row[5],
            clarification_type=row[6],
            clarification_issued_date=row[7],
            clarification_due_date=row[8],
            status=row[9]
        )
        for row in clarifications
    ]


def get_rfx_clarifications_by_status(status: str) -> List[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM rfx_clarification WHERE lower(status) = %s;"
    cursor.execute(query, (status.lower(),))
    clarifications = cursor.fetchall()

    conn.close()

    return [
        RfxClarification(
            rfx_clarification_id=row[0],
            rfx_id=row[1],
            submitted_by=row[2],
            assign_to=row[3],
            rfx_clarification_ref_num=row[4],
            clarification_title=row[5],
            clarification_type=row[6],
            clarification_issued_date=row[7],
            clarification_due_date=row[8],
            status=row[9]
        )
        for row in clarifications
    ]

def get_rfx_clarifications_by_title(clarification_title: str) -> List[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM rfx_clarification WHERE lower(clarification_title) = %s;"
    cursor.execute(query, (clarification_title.lower(),))
    clarifications = cursor.fetchall()

    conn.close()

    return [
        RfxClarification(
            rfx_clarification_id=row[0],
            rfx_id=row[1],
            submitted_by=row[2],
            assign_to=row[3],
            rfx_clarification_ref_num=row[4],
            clarification_title=row[5],
            clarification_type=row[6],
            clarification_issued_date=row[7],
            clarification_due_date=row[8],
            status=row[9]
        )
        for row in clarifications
    ]


def get_rfx_clarification_by_ref_num(rfx_clarification_ref_num: str) -> Optional[RfxClarification]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM rfx_clarification WHERE lower(rfx_clarification_ref_num) = %s;"
    cursor.execute(query, (rfx_clarification_ref_num.lower(),))
    clarification = cursor.fetchone()

    conn.close()

    if clarification:
        return RfxClarification(
            rfx_clarification_id=clarification[0],
            rfx_id=clarification[1],
            submitted_by=clarification[2],
            assign_to=clarification[3],
            rfx_clarification_ref_num=clarification[4],
            clarification_title=clarification[5],
            clarification_type=clarification[6],
            clarification_issued_date=clarification[7],
            clarification_due_date=clarification[8],
            status=clarification[9]
        )
    else:
        return None    
    


 