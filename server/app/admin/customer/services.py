from typing import Optional, List
from fastapi import HTTPException
from db.connection import get_db_connection
from .schemas import CustomerCreate, Customer
from datetime import date, datetime

def create_customer(customer_data: CustomerCreate) -> Customer:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO customer (
        tenant_id,
        company_id,
        designation_id,
        customer_name,
        email,
        phone,
        address,
        created_at,
        created_date,
        updated_date
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *;
    """

    values = (
        customer_data.tenant_id,
        customer_data.company_id,
        customer_data.designation_id,
        customer_data.customer_name,
        customer_data.email,
        customer_data.phone,
        customer_data.address,
        customer_data.created_at,
        customer_data.created_date,
        customer_data.updated_date,
    )

    cursor.execute(query, values)
    new_customer = cursor.fetchone()

    conn.commit()
    conn.close()

    if new_customer:
        return Customer(
            customer_id=new_customer[0],
            tenant_id=new_customer[1],
            company_id=new_customer[2],
            designation_id=new_customer[3],
            customer_name=new_customer[4],
            email=new_customer[5],
            phone=new_customer[6],
            address=new_customer[7],
            created_at=new_customer[8],
            created_date=new_customer[9],
            updated_date=new_customer[10],
        )
    else:
        raise HTTPException(status_code=404, detail="Customer creation failed")


def get_all_customers(tenant_id: int) -> List[Customer]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM customer WHERE tenant_id = %s;"
    cursor.execute(query,(tenant_id,))
    customers = cursor.fetchall()

    conn.close()

    return [
        Customer(
            customer_id=row[0],
            tenant_id=row[1],
            company_id=row[2],
            designation_id=row[3],
            customer_name=row[4],
            email=row[5],
            phone=row[6],
            address=row[7],
            created_at=row[8],
            created_date=row[9],
            updated_date=row[10],
        )
        for row in customers
    ]


def get_customer_by_id(customer_id: int) -> Optional[Customer]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM customer WHERE customer_id = %s;"
    cursor.execute(query, (customer_id,))
    customer = cursor.fetchone()

    conn.close()

    if customer:
        return Customer(
            customer_id=customer[0],
            tenant_id=customer[1],
            company_id=customer[2],
            designation_id=customer[3],
            customer_name=customer[4],
            email=customer[5],
            phone=customer[6],
            address=customer[7],
            created_at=customer[8],
            created_date=customer[9],
            updated_date=customer[10],
        )
    else:
        return None


def get_customer_by_name(customer_name: str) -> Optional[Customer]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM customer WHERE customer_name = %s;"
    cursor.execute(query, (customer_name,))
    customer = cursor.fetchone()

    conn.close()

    if customer:
        return Customer(
            customer_id=customer[0],
            tenant_id=customer[1],
            company_id=customer[2],
            designation_id=customer[3],
            customer_name=customer[4],
            email=customer[5],
            phone=customer[6],
            address=customer[7],
            created_at=customer[8],
            created_date=customer[9],
            updated_date=customer[10],
        )
    else:
        return None


def update_customer(customer_id: int, customer_data: CustomerCreate) -> Optional[Customer]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    UPDATE customer SET 
        customer_name = %s,
        email = %s,
        phone = %s,
        address = %s,
        created_at = %s,
        created_date = %s,
        updated_date = %s
    WHERE customer_id = %s RETURNING *;
    """

    values = (
        customer_data.customer_name,
        customer_data.email,
        customer_data.phone,
        customer_data.address,
        customer_data.created_at,
        customer_data.created_date,
        customer_data.updated_date,
        customer_id,
    )

    cursor.execute(query, values)
    updated_customer = cursor.fetchone()

    conn.commit()
    conn.close()

    if updated_customer:
        return Customer(
            customer_id=updated_customer[0],
            tenant_id=updated_customer[1],
            company_id=updated_customer[2],
            designation_id=updated_customer[3],
            customer_name=updated_customer[4],
            email=updated_customer[5],
            phone=updated_customer[6],
            address=updated_customer[7],
            created_at=updated_customer[8],
            created_date=updated_customer[9],
            updated_date=updated_customer[10],
        )
    else:
        return None


def delete_customer(customer_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "DELETE FROM customer WHERE customer_id = %s RETURNING customer_id ;"
    cursor.execute(query, (customer_id,))
    deleted_customer = cursor.fetchone()

    conn.commit()
    conn.close()

    if deleted_customer:
        return True
    else:
        return False
