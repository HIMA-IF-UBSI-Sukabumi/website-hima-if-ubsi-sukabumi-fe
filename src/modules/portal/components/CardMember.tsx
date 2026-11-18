import SocialMediaIcons from "@/components/social-media-icons";
import type { SocialMediaLinks } from "@/core/types/social-media";

type CardMemberProps = {
  imageUrl: string;
  name: string;
  socialMedia?: SocialMediaLinks | null;
};

const CardMember = ({ imageUrl, name, socialMedia }: CardMemberProps) => {
  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="relative w-85 h-85 rounded-2xl overflow-hidden border border-primary">
        <img
          src={imageUrl || "https://placehold.co/1080x1080.png"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <p className="text-gray-600 text-2xl font-light text-center">{name}</p>
      <SocialMediaIcons links={socialMedia} className="justify-center" />
    </div>
  );
};

export default CardMember;
