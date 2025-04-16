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
                    a.idEmployee,                    
                    ROW_NUMBER() OVER (PARTITION BY a.idEmployee, DATE(a.date) ORDER BY a.date, a.id) AS row_num
                FROM Attendance a
                    INNER JOIN Employee e ON e.id = a.idEmployee
                    INNER JOIN Location l ON l.id = e.idLocation
                WHERE a.date >= (${dateRouteIni}) AND a.date <= (${dateRouteFin}) 
                    AND l.idOrganization = CASE WHEN (${!esAdmin}) THEN (${session?.user.idOrganization}) ELSE l.idOrganization END                     
                    AND a.idEmployee = CASE WHEN (${idEmployee}) != '' THEN (${idEmployee}) ELSE a.idEmployee END
            ),
            attendance_calculated AS (
                SELECT 
                    t1.idEmployee,                    
                    SUM(TIME_TO_SEC(TIMEDIFF(t2.date, t1.date))) AS total_seconds
                FROM attendance_ranked t1
                LEFT JOIN attendance_ranked t2 
                    ON t1.idEmployee = t2.idEmployee 
                    AND t1.dateForm = t2.dateForm
                    AND t1.row_num + 1 = t2.row_num
                WHERE t1.row_num % 2 = 1
                GROUP BY t1.idEmployee
            )
            SELECT 
                idEmployee,                
                CONCAT(FLOOR(total_seconds / 3600), ':', MOD(FLOOR(total_seconds / 60), 60)) AS total_hours
            FROM attendance_calculated            
            ORDER BY idEmployee;
        `;                
                       
        return NextResponse.json(data);
    } catch (error) { 
        console.log(error);       
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
