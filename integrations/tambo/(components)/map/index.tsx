import { withInteractable } from "@tambo-ai/react";
import { z } from "zod";
import { AreaSelectMap } from "~/integrations/tambo/(components)/area-select-map";

function MapComponent({ height }: { height: number }) {
  return (
    <div className="relative w-full">
     <AreaSelectMap height={height} />
    </div>
  )
}

export const InterctableMap = withInteractable(MapComponent, {
  componentName: 'map',
  description: 'A map component for selecting an area on a map and analyzing the area for things to do and add pins to the map',
  // propsSchema: z.object({
  //   height: z.number().optional().default(356),
  // }),
})