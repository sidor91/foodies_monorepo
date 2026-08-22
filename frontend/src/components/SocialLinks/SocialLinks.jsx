const socialLinks = [
  {
    id: 1,
    name: "Facebook",
    icon: "facebook",
    link: "https://www.facebook.com/goITclub/",
  },
  {
    id: 2,
    name: "Youtube",
    icon: "youtube",
    link: "https://www.youtube.com/c/GoIT",
  },
  {
    id: 3,
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/goitclub/",
  },
];

const SocialLinks = () => {
  return (
    <ul className="flex items-center justify-center gap-[1.6rem]">
      {socialLinks.map((link) => (
        <li key={link.name} className="p-[0.8rem] border border-secondary rounded-[50%] tablet:p-4">
          <a href={link.link} aria-label={link.name} target="_blank" rel="noopener noreferrer">
            <svg className="w-8 h-8 fill-accent" aria-label={link.name}>
              <use href={`/icons.svg#icon-${link.icon}`} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;
