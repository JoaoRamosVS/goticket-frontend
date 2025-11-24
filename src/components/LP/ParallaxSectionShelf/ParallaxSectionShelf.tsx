"use client";

import { motion } from "framer-motion";

import type { ParallaxSectionShelfProps, ColumnProps } from "./types";
import { parallaxSectionShelfSchema } from "./schema";
import { useParallax } from "./hooks/useParallax";

const ParallaxSectionShelf = ({
	images = parallaxSectionShelfSchema.images,
}: ParallaxSectionShelfProps) => {
	const { gallery, y, y2, y3, y4 } = useParallax();

	return (
		<main className="w-full text-black">
			<div
				ref={gallery}
				className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden p-[2vw]"
			>
				<Column images={[images[0], images[1], images[2]]} y={y} />
				<Column images={[images[3], images[4], images[5]]} y={y2} />
				<Column images={[images[6], images[7], images[8]]} y={y3} />
				<Column images={[images[6], images[7], images[8]]} y={y4} />
			</div>
		</main>
	);
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] nth-2:top-[-95%] nth-3:top-[-45%] nth-4:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-auto w-full ">
          <img
            src={`${src}`}
            alt="image"
            className="pointer-events-none object-cover rounded-4xl"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { ParallaxSectionShelf };