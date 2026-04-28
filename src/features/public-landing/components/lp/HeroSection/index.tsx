import { ArrowUpRight, Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import type { HeroSectionProps } from "./types";
import { heroSectionSchema } from "./schema";
import { textVariants, imageInitial, imageAnimate, imageTransition } from "./animations";
import { useTypingEffect } from "./hooks/useTypingEffect";

const HeroSection = ({
	heading = heroSectionSchema.heading,
	headingSubTitle = heroSectionSchema.headingSubTitle,
	description = heroSectionSchema.description,
	buttons = heroSectionSchema.buttons,
	reviews = heroSectionSchema.reviews,
	image = heroSectionSchema.image,
}: HeroSectionProps) => {

	const { displayedText, showCursor } = useTypingEffect({
		text: headingSubTitle,
	});

	return (
		<section className="mt-24 lg:mt-16 min-h-11/12">
			<div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20 lg:mx-auto p-4">
				
				<motion.div
					initial="hidden"
					animate="visible"
					variants={textVariants}
					className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start 
					lg:text-left"
				>
					<h1 className="mb-2 text-pretty xl:leading-24 text-4xl font-black lg:text-6xl xl:text-7xl">
						{heading}
					</h1>

					<h1 className="mb-8 text-4xl font-black lg:text-6xl xl:text-7xl">
						<span className="bg-linear-to-r from-blue-600 via-cyan-500 to-primary bg-clip-text text-transparent">
							{displayedText}
						</span>
						<span
							className={`inline-block bg-cyan-500/40 bg-clip-text w-auto text-transparent ${
								showCursor ? "opacity-100" : "opacity-0"
							}`}
							style={{
								transition: "opacity 0.1s",
							}}
						>
							|
						</span>
					</h1>

					<p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
						{description}
					</p>

					<div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
						<span className="inline-flex items-center -space-x-4">
							{reviews.avatars.map((avatar, index) => (
								<Avatar key={index} className="size-12 border">
									<AvatarImage
										src={avatar.src}
										alt={avatar.alt}
									/>
								</Avatar>
							))}
						</span>
						<div>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, index) => (
									<Star
										key={index}
										className="size-5 fill-yellow-400 text-yellow-400"
									/>
								))}
								<span className="mr-1 font-semibold">
									{reviews.rating?.toFixed(1)}
								</span>
							</div>
							<p className="text-muted-foreground text-left font-medium">
								+ de {reviews.count} reviews!
							</p>
						</div>
					</div>

					<div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
						{buttons.primary && (
							<Button
								asChild
								variant="outline"
								className="w-full sm:w-auto shadow-2xl text-xl border-0 text-card hover:scale-95 
									hover:text-card bg-linear-to-r rounded-full p-6 from-primary to-[#2959b9]
								"
							>
								<Link to={buttons.primary.url}>
									{buttons.primary.text}
								</Link>
							</Button>
						)}
						{buttons.secondary && (
							<Button
								asChild
								variant="outline"
								className="rounded-full text-xl p-6 hover:scale-95"
							>
								<Link to={buttons.secondary.url}>
									{buttons.secondary.text}
									<ArrowUpRight className="size-4" />
								</Link>
							</Button>
						)}
					</div>
				</motion.div>

				<motion.div
					initial={imageInitial}
					animate={imageAnimate}
					transition={imageTransition}
					className="flex"
				>
					<img
						src={image.src}
						alt={image.alt}
						className="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px] xl:scale-120"
					/>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
