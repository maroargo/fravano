import BarComponent from "@/charts/bar";

const Dashboard = async () => {  
  return (
    <div className="mi-grilla">
      <div>
        <BarComponent />
      </div>
      <div>
        <BarComponent />
      </div>
      <div>
        <BarComponent />
      </div>
      <div>
        <BarComponent />
      </div>
    </div>
  );
};

export default Dashboard;

/*
import { auth } from "@/auth";

export default async function Home() {
    
  const session = await auth();
    
  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>        
    </div>
  ); 
}*/
  
