import BarComponent from "@/charts/bar";
import PieComponent from "@/charts/pie";

export default async function Home() {
       
  return (
    <div className="mi-grilla">
      <div>
        <BarComponent />
      </div>
      <div>
        <BarComponent />
      </div>             
    </div>
  ); 
}