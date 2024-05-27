"use client";

import { Category } from "@prisma/client";

import { CategoryItem } from "./category-item";
interface CategoriesProps{
    items:Category[];
}

import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
    FcStatistics
} from 'react-icons/fc'
import { GiArtificialIntelligence,
    GiArtificialHive ,GiProcessor} from "react-icons/gi";
import { SiArtifacthub,SiFreedesktopdotorg } from "react-icons/si";
import { IconType } from "react-icons";
import { FaConnectdevelop } from "react-icons/fa";
const iconMap:Record<Category["name"], IconType>={
    "Statistics Basics":FcStatistics,
    "Basic Machine Learning":SiFreedesktopdotorg,
    "Advanced Machine learning":FaConnectdevelop,
    "Foundation of Artifical intelligence":GiArtificialIntelligence,
    "Image processing using tensorflow":GiProcessor
}


export const Categories=({items} : CategoriesProps)=>{
    return(
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2 gap-10 p-5">
            {
                items.map((item)=>(
                    <CategoryItem
                        key={item.id}
                        label={item.name}
                        icon={iconMap[item.name]}
                        value={item.id}
                    />
                ))
            }
        </div>
    )
}