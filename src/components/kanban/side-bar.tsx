'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarItem = {
  label: string;
  locked?: boolean;
  href?: string;
  badge?: number;
  active?: boolean;
  icon: React.ReactNode;
};

function LockedBadge({ badge }: { badge?: number }) {
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-500">
      {badge ?? 'Light'}
    </span>
  );
}

function SidebarLink({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const isActive =
    item.href &&
    (pathname === item.href ||
      (item.href !== '/' && pathname.startsWith(item.href)));

  const content = (
    <>
      <div className="flex items-center gap-3">
        {item.icon}
        <span>{item.label}</span>
      </div>

      {item.locked && <LockedBadge badge={item.badge} />}
      {!item.locked && item.badge && (
        <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs font-bold text-white">
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.locked) {
    return (
      <div
        title="Disponível apenas no plano completo"
        className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-[#9E9E9E] opacity-70"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={item.href ?? '#'}
      className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
        isActive ? 'bg-white/10 text-white' : 'text-[#9E9E9E] hover:bg-white/5'
      }`}
    >
      {content}
    </Link>
  );
}

export function Sidebar() {
  const iconClass = 'h-5 w-5 shrink-0';

  const pathname = usePathname();

  const navItems: SidebarItem[] = [
    {
      label: 'Home',
      locked: true,
      icon: (
        <svg
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l9-9 9 9M4 10v10h6v-6h4v6h6V10"
          />
        </svg>
      ),
    },
    {
      label: 'Projetos',
      locked: true,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_106_581)">
            <g clipPath="url(#clip0_106_581)">
              <path
                d="M5 1.25V16.75C5 16.75 5.00805 18.1127 5.5 18.75C6.03359 19.4412 7.5 19.75 7.5 19.75H23.5M17.5 13.75H22.5M10.5 9.75H20.5M8.5 5.75H15.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_106_581"
              x="-3.25"
              y="0"
              width="32"
              height="32"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_106_581"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_106_581"
                result="shape"
              />
            </filter>
            <clipPath id="clip0_106_581">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="translate(0.75)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: 'Histórias de Usuário',
      locked: true,
      icon: (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_106_585)">
            <path
              d="M12.5416 18.2915H16.7083"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.875 18.2915H22.9583"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5416 14.125H14.625"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.7916 14.125H22.9583"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M27.125 20.375C27.125 20.9275 26.9055 21.4574 26.5148 21.8481C26.1241 22.2388 25.5942 22.4583 25.0417 22.4583H12.5417L8.375 26.625V9.95833C8.375 9.4058 8.59449 8.87589 8.98519 8.48519C9.37589 8.09449 9.9058 7.875 10.4583 7.875H25.0417C25.5942 7.875 26.1241 8.09449 26.5148 8.48519C26.9055 8.87589 27.125 9.4058 27.125 9.95833V20.375Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_106_585">
              <rect width="30" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: 'Kanban',
      href: '/board',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 36 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.25 4.05721V25.7437C3.25 25.7437 3.65238 26.6331 4.14286 26.9485C4.64305 27.2702 5.63095 27.2497 5.63095 27.2497H11.5833C11.5833 27.2497 12.3469 27.1689 12.7738 26.9485C13.3595 26.6461 13.9643 25.7437 13.9643 25.7437V4.05721C13.9643 4.05721 13.7366 3.22437 13.369 2.8524C12.8493 2.32636 11.5833 2.25 11.5833 2.25H5.63095C5.63095 2.25 4.36502 2.32636 3.84524 2.8524C3.47769 3.22437 3.25 4.05721 3.25 4.05721Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M17.5357 4.05721V16.7077C17.5357 16.7077 17.7634 17.5405 18.131 17.9125C18.6507 18.4385 19.9167 18.5149 19.9167 18.5149H25.869C25.869 18.5149 26.8643 18.303 27.3571 17.9125C27.8147 17.5499 28.25 16.7077 28.25 16.7077V4.05721C28.25 4.05721 28.0223 3.22437 27.6548 2.8524C27.135 2.32636 25.869 2.25 25.869 2.25H19.3214C19.3214 2.25 18.4985 2.48044 18.131 2.8524C17.7634 3.22437 17.5357 4.05721 17.5357 4.05721Z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3H3V12H10V3Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3H14V8H21V3Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12H14V21H21V12Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 16H3V21H10V16Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Sprint Planning',
      locked: true,
      icon: (
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_106_593)">
            <path
              d="M13.5671 18H18.75C19.0261 18 19.25 18.2239 19.25 18.5C19.25 18.7761 19.0261 19 18.75 19H1.75C1.47386 19 1.25 18.7761 1.25 18.5C1.25 18.2239 1.47386 18 1.75 18H10.2476L10.2493 18C11.5669 17.9981 12.8379 17.4831 13.7855 16.5355C15.7382 14.5829 15.7382 11.4171 13.7855 9.46447C13.4051 9.08399 12.9785 8.77765 12.5239 8.54545C12.5049 8.53737 12.4864 8.52806 12.4683 8.5175C10.8025 7.69292 8.77275 7.85375 7.24895 9H8.75C9.02614 9 9.25 9.22386 9.25 9.5C9.25 9.77614 9.02614 10 8.75 10H5.75C5.47386 10 5.25 9.77614 5.25 9.5V6.5C5.25 6.22386 5.47386 6 5.75 6C6.02614 6 6.25 6.22386 6.25 6.5V8.52764C7.71401 7.21593 9.66737 6.74895 11.4798 7.12669C11.3341 6.75531 11.25 6.36566 11.25 6C11.25 4.34315 12.5931 3 14.25 3H14.5429L14.3964 2.85355C14.2012 2.65829 14.2012 2.34171 14.3964 2.14645C14.5917 1.95118 14.9083 1.95118 15.1036 2.14645L16.1036 3.14645C16.2988 3.34171 16.2988 3.65829 16.1036 3.85355L15.1036 4.85355C14.9083 5.04882 14.5917 5.04882 14.3964 4.85355C14.2012 4.65829 14.2012 4.34171 14.3964 4.14645L14.5429 4H14.25C13.1454 4 12.25 4.89543 12.25 6C12.25 6.56129 12.5801 7.27279 13.0017 7.66638C13.5386 7.94356 14.0425 8.30722 14.4926 8.75736C16.8358 11.1005 16.8358 14.8995 14.4926 17.2426C14.2069 17.5284 13.8966 17.7813 13.5671 18Z"
              fill="white"
              stroke="white"
              strokeWidth="0.75"
            />
          </g>
          <defs>
            <clipPath id="clip0_106_593">
              <rect width="20.5" height="20.5" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  const bottomItems: SidebarItem[] = [
    {
      label: 'Notificações',
      locked: true,
      badge: 12,
      icon: (
        <svg
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      label: 'Suporte',
      locked: true,
      icon: (
        <svg
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 1 1-12.728 0M12 3v9"
          />
        </svg>
      ),
    },
    {
      label: 'Configurações',
      locked: true,
      icon: (
        <svg
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      label: 'Logout',
      locked: true,
      icon: (
        <svg
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#1E1E1E] px-4 py-6">
      <div className="flex items-baseline gap-1 px-2">
        <Image
          src="/icons/logo-monocromatica-branca-com-fundo-transparente 3.png"
          alt="Kanplan logotipo"
          width={64}
          height={64}
        />
        <h1 className="text-xl font-bold text-white">Kanplan</h1>
        <span className="text-sm font-light text-zinc-300">light.</span>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-[#2C2C2C] px-3 py-2 text-sm text-[#9E9E9E]">
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <span>Search</span>
      </div>

      <nav className="mt-6 flex flex-col gap-1 text-sm">
        {navItems.map((item) => (
          <SidebarLink key={item.label} item={item} />
        ))}
      </nav>

      <nav className="mt-auto flex flex-col gap-1 text-sm">
        {bottomItems.map((item) => (
          <SidebarLink key={item.label} item={item} />
        ))}

        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#2C2C2C] px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-white">
                R
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#1E1E1E]" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Ricardo</p>
              <p className="text-xs text-[#9E9E9E]">ricardo@email.com</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
