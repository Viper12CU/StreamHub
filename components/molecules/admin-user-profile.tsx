interface AdminUserProfileProps {
  name?: string
  role?: string
  avatar?: string
}

export function AdminUserProfile({
  name = "Admin Profile",
  role = "Fulfillment Lead",
  avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDBOE58Wvu52_LpHOQphdJw_4c9YX9-M03OaRea8ksR3YTK5GfbIIt_oqAknfV08R0Cu4TphlDWDifVJDeSekMHCziBSEHMJNy9v6wlzCZVwB1sTiPdosKpKd4KdquWh9VLWVqyKlVnTRTQF_guOXjMPzMS54KK3pzU7GaEzO4KqndZiXscz5BmDO-T0hL_o2TmVmidMJ2ODT_4DNyRX9V2FnuGGOIYki3mWYHl6vmaazDWDzbGooggaxzcc8ydMwk_wwhquaStnw",
}: AdminUserProfileProps) {
  return (
    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
      <div className="text-right hidden sm:block">
        <p className="text-xs font-semibold text-on-surface">{name}</p>
        <p className="text-xs text-primary font-bold">{role}</p>
      </div>
      <img
        alt="Administrator profile picture"
        className="w-10 h-10 rounded-full border-2 border-primary/20"
        src={avatar}
      />
    </div>
  )
}
