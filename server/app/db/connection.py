import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        dbname="test1",
        user="postgres",
        password="N45KJb456ub6TU2xWME7",
        host="database-1.c7iu0ws0ozdw.us-west-2.rds.amazonaws.com",
        port="5432"
    )
    return conn