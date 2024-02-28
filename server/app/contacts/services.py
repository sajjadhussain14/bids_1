from typing import List, Optional
from fastapi import HTTPException
from db.connection import get_db_connection
from contacts.schemas import ContactsCreate, Contacts

def create_contacts(item_form_data: ContactsCreate) -> Contacts:
    conn = get_db_connection()
    cursor = conn.cursor()


    query = """
    INSERT INTO contacts (
        tenant_id,
        rfx_id,
        contact_user_id,
        conatct_key,
        created_date,
        created_at
    ) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *;
    """

    values = (
        item_form_data.tenant_id,
        item_form_data.rfx_id,
        item_form_data.contact_user_id,
        item_form_data.conatct_key,
        item_form_data.created_date,
        item_form_data.created_at

    )

    cursor.execute(query, values)
    new_item = cursor.fetchone()

   
    conn.commit()
    conn.close()

    if new_item:
        return Contacts(
            contact_id=new_item[0],
            tenant_id=new_item[1],
            rfx_id=new_item[2],
            contact_user_id=new_item[3],
            conatct_key=new_item[4],
            created_date=new_item[5],
            created_at=new_item[6]
        )
    else:
        raise HTTPException(status_code=404, detail="Contacts creation failed")


def get_all_contacts(tenant_id: int) -> List[Contacts]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT * FROM contacts              
        WHERE tenant_id = %s ;
        """

    cursor.execute(query,(tenant_id, ))
    query_all_items = cursor.fetchall()

    conn.close()
    if query_all_items:
        return [
            Contacts(
                contact_id=row[0],
                tenant_id=row[1],
                rfx_id=row[2],
                contact_user_id=row[3],
                conatct_key=row[4],
                created_date=row[5],
                created_at=row[6]
            )
            for row in query_all_items
        ]
    else:
        None

def update_contacts(contact_id: int,  contact_data: ContactsCreate) -> Optional[Contacts]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE contacts SET 
        contact_user_id = %s,
        conatct_key = %s
    WHERE contact_id = %s RETURNING *;
    """

    values = (
        contact_data.contact_user_id,
        contact_data.conatct_key,
        contact_id
    )

    cursor.execute(query, values)
    updated_itemm = cursor.fetchone()

    
    conn.commit()
    conn.close()

    if updated_itemm:
        return Contacts(
            contact_id=updated_itemm[0],
            tenant_id=updated_itemm[1],
            rfx_id=updated_itemm[2],
            contact_user_id=updated_itemm[3],
            conatct_key=updated_itemm[4],
            created_date=updated_itemm[5],
            created_at=updated_itemm[6]
        )
    else:
        raise HTTPException(status_code=404, detail="Contacts update failed")


def delete_contacts(contact_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
   
    query = "DELETE FROM contacts WHERE contact_id = %s RETURNING contact_id;"
    cursor.execute(query, (contact_id,))
    deleted_item = cursor.fetchone()

    conn.commit()
    conn.close()

    if deleted_item:
        return True
    else:
        return False
    
def get_contacts_by_id(tenant_id: int, contact_id: int) -> List[Contacts]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM contacts WHERE tenant_id = %s AND contact_id = %s ;"

    cursor.execute(query, (tenant_id, contact_id))
    get_all_items = cursor.fetchall()

    conn.close()

    if get_all_items:
        return [
            Contacts(
                contact_id=row[0],
                tenant_id=row[1],
                rfx_id=row[2],
                contact_user_id=row[3],
                conatct_key=row[4],
                created_date=row[5],
                created_at=row[6]
            )
            for row in get_all_items
        ]
    else:
        None


def get_contacts_by_rfx_id(tenant_id: int, rfx_id: int) -> List[Contacts]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM contacts WHERE tenant_id = %s AND rfx_id = %s ;"

    cursor.execute(query, (tenant_id, rfx_id))
    get_all_items = cursor.fetchall()

    conn.close()

    if get_all_items:
        return [
            Contacts(
                contact_id=row[0],
                tenant_id=row[1],
                rfx_id=row[2],
                contact_user_id=row[3],
                conatct_key=row[4],
                created_date=row[5],
                created_at=row[6]
            )
            for row in get_all_items
        ]
    else:
        None
    
def get_contacts_by_rfx_id_and_key(tenant_id: int,rfx_id: int, conatct_key: str) -> List[Contacts]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM contacts WHERE tenant_id = %s AND rfx_id = %s AND lower(conatct_key) = %s ;"

    cursor.execute(query, (tenant_id, rfx_id, conatct_key.lower()))
    get_all_items = cursor.fetchall()

    conn.close()

    if get_all_items:
        return [
            Contacts(
                contact_id=row[0],
                tenant_id=row[1],
                rfx_id=row[2],
                contact_user_id=row[3],
                conatct_key=row[4],
                created_date=row[5],
                created_at=row[6]
            )
            for row in get_all_items
        ]
    else:
        None