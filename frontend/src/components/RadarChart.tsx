'use client'
import { useState, useRef, useEffect } from "react";
import { fetchRadarData } from "@/app/lib/apiDashboard";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";

const points1 = [
    { x: 0, y: -90 },
    { x: 57.9, y: -68.9 },
    { x: 88.6, y: -15.6 },
    { x: 77.9, y: 45.0 },
    { x: 30.8, y: 84.6 },
    { x: -30.8, y: 84.6 },
    { x: -77.9, y: 45.0 },
    { x: -88.6, y: -15.6 },
    { x: -57.9, y: -68.9 },
];

const scaleFactor : number = 0.8;

const points2 = points1.map((
    {x, y}) => ({
        x: x * scaleFactor,
        y: y * scaleFactor,
    }
));

const points3 = points1.map((
    {x, y}) => ({
        x: x * (2 * scaleFactor - 1),
        y: y * (2 * scaleFactor - 1),
    }
));

const points4 = points1.map((
    {x, y}) => ({
        x: x * (3 * scaleFactor - 2),
        y: y * (3 * scaleFactor - 2),
    }
));


const points5 = points1.map((
    {x, y}) => ({
        x: x * (4 * scaleFactor - 3),
        y: y * (4 * scaleFactor - 3),
    }
));


const pointsData =  [
    17.2,
    3,
    17,
    3.5,
    9.1,
    1,
    15,
    7.3,
    13
]

const skills = [
    "Quick Reflexes",
    "Strategic Thinking",
    "Precision Shots",
    "Pattern Recognition",
    "Anticipating Moves",
    "Board Control",
    "Adaptive Playstyle",
    "Risk Management",
    "Mind Games",
];

function isPointBetweenAngles(x1: number, y1: number, sep1: { x: number, y: number }, sep2: { x: number, y: number }): boolean {
    const pointAngle = Math.atan2(y1, x1);
    const angle1 = Math.atan2(sep1.y, sep1.x);
    const angle2 = Math.atan2(sep2.y, sep2.x);

    const twoPi = Math.PI * 2;

    const normalize = (angle: number) => (angle + twoPi) % twoPi;

    const a = normalize(pointAngle);
    const start = normalize(angle1);
    const end = normalize(angle2);
    
    if (start < end) return a >= start && a <= end;
    return a >= start || a <= end;
}

export function RadarChart() {
    const { loggedUserName } = useLoggedUserName();
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const [radarData, setRadarData] = useState<number[] | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    // State to hold the coordinates of the mouse pointer
    const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    
    const getScaleFactor = (x: number) => 0.2 + (x / 20) * 0.8;
    // const radarData = [12.4,19.7,4.3,8.6,17.1,0.9,15.5,6.2,2.8];

    // Fetch radar data from the API
    useEffect(() => {
        if (loggedUserName) {
          fetchRadarData(loggedUserName)
            .then((data) => {
              const radarDataArray = [
                data.Quick_Reflexes,
                data.Strategic_Thinking,
                data.Precision_Shots,
                data.Pattern_Recognition,
                data.Anticipating_Moves,
                data.Board_Control,
                data.Adaptive_Playstyle,
                data.Risk_Management,
                data.Mind_Games,
              ];
              setRadarData(radarDataArray);
            })
            .catch((err) => console.error("Error: ", err));
        }
      }, [loggedUserName]);
      

    if (!radarData) {
        return <div className="text-white/10">Loading radarData...</div>;
    }
    

    // Scale the points based on the radar data
    const scaledPoints = radarData.map((value: number, index) => {
        const scale = getScaleFactor(value);
        return {
            x: points1[index].x * scale,
            y: points1[index].y * scale,
        }
    });

    // Calculate the midpoints for the separators
    // between the points to create the radar chart's sectors
    const sperators: { x: number; y: number }[] = [];

    for (let i = 1; i < 9; i++) {
        sperators.push(
            {
                x: (points1[i].x + points1[i - 1].x) / 2,
                y: (points1[i].y + points1[i - 1].y) / 2
            }
        )
    }

    sperators.push(
        {
            x: (points1[0].x + points1[8].x) / 2,
            y: (points1[0].y + points1[8].y) / 2
        }
    )


    // Reference to the SVG element 
    // to calculate the mouse position relative to the SVG

    // Function to set the hovered index based on the coordinates
    const setActivatedCircleIndex = (() => {
        if (coords.x === 0 && coords.y === 0)
            return ;

        if (isPointBetweenAngles(coords.x, coords.y, sperators[0], sperators[1]))
            setHoveredIndex(1);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[1], sperators[2]))
            setHoveredIndex(2);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[2], sperators[3]))
            setHoveredIndex(3);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[3], sperators[4]))
            setHoveredIndex(4);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[4], sperators[5]))
            setHoveredIndex(5);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[5], sperators[6]))
            setHoveredIndex(6);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[6], sperators[7]))
            setHoveredIndex(7);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[7], sperators[8]))
            setHoveredIndex(8);
        else if (isPointBetweenAngles(coords.x, coords.y, sperators[8], sperators[0]))
            setHoveredIndex(0);
    })

    // Handle mouse movement over the SVG to calculate coordinates and set hovered index
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width) * 200 - 100;
        const py = ((event.clientY - rect.top) / rect.height) * 200 - 100;

        setCoords(
            {
                x: Number(px),
                y: Number(py)
            }
        )

        setActivatedCircleIndex();

    }

    // Reset coordinates and hovered index when mouse leaves the SVG
    const resetCoords = () => {
        setCoords(
            {
                x: Number(0),
                y: Number(0)
            }
        )
        setHoveredIndex(-1);
    };
    
    return (
        <div className="w-[100%] md:w-[40%] aspect-square  flex flex-col items-center justify-center my-5 bg-black/40">
            <svg ref={svgRef} className="w-[100%]  aspect-square" viewBox="-100 -100 200 200" onMouseMove={handleMouseMove} onMouseLeave={resetCoords}>
                {
                    sperators.map((point, index) => (
                        <line
                        key={index}
                        x1={0}
                        y1={0}
                        x2={point.x}
                        y2={point.y}
                        className="stroke-2 stroke-white/10"
                        />
                    ))
                }
                <polygon
                    points={points1.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/20 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points2.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/30 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points3.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/40 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points4.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/50 stroke-white/15 stroke-2"
                />
                <polygon
                    points={points5.map(p => `${p.x},${p.y}`).join(' ')}
                    className="fill-[#FEDF7F]/60 stroke-white/15 stroke-2"
                />
                <circle cx="0" cy="0" r="7.5" className="fill-black" />

                {/* define gradient color */}
                <defs>
                    <linearGradient id="myGradient">
                    <stop offset="0%" stopColor="#FE9734" stopOpacity="0.7"/>
                    <stop offset="50%" stopColor="#ED66B7" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#5360CB" stopOpacity="0.7"/>
                    </linearGradient>
                </defs>

                <polygon
                    points={scaledPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    className="stroke-[#531E2E]/75 stroke-2"
                    fill="url(#myGradient)"
                />

                {
                    scaledPoints.map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === index ? 3.3 : 2.3}
                            className={hoveredIndex === index ? "fill-[#632133]" : "fill-[#632133]"}
                            onMouseEnter={() => setHoveredIndex(index)}
                        />
                    ))
                }
                

                <circle cx={coords.x} cy={coords.y} r="2"
                    className={(coords.x === 0 && coords.y === 0) ? "fill-transparent" : "fill-[#632133]"}
                />
            </svg>
            {hoveredIndex !== -1 && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-[#FEDF7F] font-bold">{skills[hoveredIndex]}</h1>
                    <h1 className="text-l md:text-xl xl:text-2xl 2xl:text-3xl text-[#FEDF7F]/80 font-bold">{radarData[hoveredIndex]} / 20</h1>
                </div>
            )}
        </div>
    );

}