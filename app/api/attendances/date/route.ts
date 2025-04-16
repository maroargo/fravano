import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const idEmployee = request.nextUrl.searchParams.get('idEmployee');        
        const dateRouteParamIni = request.nextUrl.searchParams.get('dateRouteIni');                
        const dateRouteParamEnd = request.nextUrl.searchParams.get('dateRouteEnd');                

        const dateRouteIni = new Date(new Date(dateRouteParamIni ? dateRouteParamIni : "").setHours(0, 0, 0, 0));
        const dateRouteFin = new Date(new Date(dateRouteParamEnd ? dateRouteParamEnd : "").setHours(23, 59, 59, 999));

        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.$queryRaw`
            WITH attendance_ranked AS (
                SELECT 
                    a.id,
                    a.date,
                    DATE(a.date) AS dateForm,
                    a.type,
                    a.notes,
                    a.idEmployee,
                    e.identifier,
                    e.firstName,
                    e.lastName,
                    ROW_NUMBER() OVER (PARTITION BY a.idEmployee, DATE(a.date) ORDER BY a.date, a.id) AS row_num
                FROM Attendance a
                    INNER JOIN Employee e ON e.id = a.idEmployee
                    INNER JOIN Location l ON l.id = e.idLocation
                WHERE a.date >= (${dateRouteIni}) AND a.date <= (${dateRouteFin})
                    AND l.idOrganization = CASE WHEN (${!esAdmin}) THEN (${session?.user.idOrganization}) ELSE l.idOrganization END
                    AND a.idEmployee = CASE WHEN (${idEmployee}) != '' THEN (${idEmployee}) ELSE a.idEmployee END
            )
            SELECT 
                t1.id,                
                CASE WHEN t1.row_num = 1 THEN t1.date ELSE '' END AS date,
                CASE WHEN t1.row_num = 1 THEN t1.idEmployee ELSE '' END AS idEmployee,
                CASE WHEN t1.row_num = 1 THEN t1.firstName ELSE '' END AS firstName,
                CASE WHEN t1.row_num = 1 THEN t1.lastName ELSE '' END AS lastName,
                CASE WHEN t1.row_num = 1 THEN t1.identifier ELSE '' END AS identifier,
                t1.type AS type_in,
                t1.notes AS notes_in,
                t1.date AS time_in,
                t2.type AS type_out,
                t2.notes AS notes_out,
                t2.date AS time_out,
                time_format(timediff(t2.date,t1.date), '%H:%i') AS hours_diff                                
            FROM attendance_ranked t1
            LEFT JOIN attendance_ranked t2 
                ON t1.idEmployee = t2.idEmployee 
                AND t1.dateForm = t2.dateForm
                AND t1.row_num + 1 = t2.row_num
            WHERE t1.row_num % 2 = 1
            ORDER BY t1.idEmployee, t1.date, t1.row_num;
        `;        
                       
        return NextResponse.json(data);
    } catch (error) { 
        console.log(error);       
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
