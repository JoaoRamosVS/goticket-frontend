import type { HeroSectionContent } from "./types";

export const heroSectionSchema: HeroSectionContent = {
	heading: "Seu ingresso aqui.",
	headingSubTitle: "Em 1 clique.",
	description: "Esqueça burocracia, lentidão e plataformas confusas. Criamos a forma mais rápida, elegante e intuitiva de criar, vender e gerir ingressos: Tudo em uma experiência que parece mágica.",
	buttons: {
		primary: {
			text: "Cadastrar-se",
			url: "/cadastro",
		},
		secondary: {
			text: "Acessar",
			url: "/login",
		},
	},
	reviews: {
		count: 200,
		rating: 5.0,
		avatars: [
			{
				src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
				alt: "Avatar 1",
			},
			{
				src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
				alt: "Avatar 2",
			},
			{
				src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
				alt: "Avatar 3",
			},
			{
				src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
				alt: "Avatar 4",
			},
			{
				src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
				alt: "Avatar 5",
			},
		],
	},
	image: {
		src: "https://static.vecteezy.com/system/resources/previews/060/574/240/non_2x/light-blue-3d-calendar-icon-with-tick-mark-on-transparent-background-design-free-png.png",
		alt: "placeholder hero",
	},
};

