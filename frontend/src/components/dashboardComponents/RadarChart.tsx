'use client'
import { useState, useRef, useEffect } from "react";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { fetchRadarData } from "@/app/lib/apiDashboard";

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
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const [radarData, setRadarData] = useState<number[] | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const { selectedUserName, setSelectedUserName } = useSelectedUserName();
    
    const getScaleFactor = (x: number) => 0.2 + (x / 20) * 0.8;

    // Demo data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRadarData(selectedUserName);
                const values : number[] = Object.values(data);
                for (let i = 0; i < values.length; i++) {
                    values[i] = Number(values[i].toFixed(2));
                }
                setRadarData(values);
            } catch (error) {
                console.error("Failed to fetch radar data:", error);
            }
        };
    
        fetchData();
    }, [selectedUserName]);
    

    if (!radarData) {
        return <div className="text-white/10">Loading radarData...</div>;
    }

    const scaledPoints = radarData.map((value: number, index) => {
        const scale = getScaleFactor(value);
        return {
            x: points1[index].x * scale,
            y: points1[index].y * scale,
        }
    });

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
        <div className="m-1 text-white w-full h-[100%] flex justify-center items-center
        bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:from-black/50 hover:to-black/30 rounded-2xl transition-all duration-300 hover:scale-103 border border-white/7
        "
        >
            <svg 
                ref={svgRef} 
                className="w-[75%] aspect-square" 
                viewBox="-100 -100 200 200" 
                onMouseMove={handleMouseMove} 
                onMouseLeave={resetCoords}
            >
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
                <div className="absolute pointer-events-none"
                    style={{
                        // left: '50%',
                        // top: '50%',
                        transform: `translate(calc(-50% + ${scaledPoints[hoveredIndex].x * 0.45}%), calc(-50% + ${scaledPoints[hoveredIndex].y * 0.45}% - 60px))`
                    }}>
                    <div className="bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-sm
                        px-3 py-2 sm:px-4 sm:py-2.5 
                        rounded-xl border border-[#FEDF7F]/30 shadow-2xl
                        min-w-[140px] sm:min-w-[160px]
                        animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="flex flex-col items-center gap-1">
                            <h3 className="text-[10px] sm:text-xs md:text-sm 
                                text-[#FEDF7F] font-bold text-center leading-tight">
                                {skills[hoveredIndex]}
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm sm:text-base md:text-lg 
                                    text-white font-bold">
                                    {radarData[hoveredIndex]}
                                </span>
                                <span className="text-[9px] sm:text-[10px] md:text-xs 
                                    text-white/60 font-medium">
                                    / 20
                                </span>
                            </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 
                            w-3 h-3 bg-gradient-to-br from-black/95 to-black/90 
                            border-r border-b border-[#FEDF7F]/30 rotate-45" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default RadarChart;