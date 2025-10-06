import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";
import { cn } from "@/lib/utils";
import Logo from "../commons/Logo";
import { useTranslations } from "next-intl";
import { List, X } from "@phosphor-icons/react";
import ThemeToggle from "../commons/ThemeToggle";
import LocaleSwitch from "../commons/LocaleSwitch";
import { navigationLinks } from "@/lib/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import MaxWidthWrapper from "../commons/MaxWidthWrapper";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");

  return (
    <Disclosure as="nav" className={"fixed inset-x-0 top-0 z-50 bg-background"}>
      {/* Header */}
      <MaxWidthWrapper>
        <header className="h-header flex justify-between items-center">
          <div className="flex">
            <Logo />
          </div>
          {/* Navigation */}
          <div className="hidden lg:ml-6 lg:flex lg:space-x-8 items-center">
            {navigationLinks.map((link) => (
              <Link
                key={link.tradKey}
                href={link.url}
                className={cn(
                  "hover:text-foreground/80 duration-200",
                  pathname === link.url
                    ? "text-accent font-bold"
                    : "text-foreground/60 font-medium"
                )}
              >
                {t(`navigation.${link.tradKey}`)}
              </Link>
            ))}
          </div>

          {/* Lang & Theme */}
          <div className="hidden lg:ml-6 lg:flex lg:items-center lg:gap-4">
            <ThemeToggle />
            <LocaleSwitch />

            {/* DropDown */}
            {/* {session ? (
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative cursor-pointer flex rounded-full text-sm focus:outline-none border border-transparent hover:border-element duration-200">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">{t("openUserMenu")}</span>
                    <Image
                      alt="avatar"
                      src={
                        session?.user.image
                          ? session.user.image
                          : "/no-avatar.webp"
                      }
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-element py-1 shadow-lg ring-0 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {session.user?.role === "ADMIN" && (
                    <MenuItem>
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm data-[focus]:bg-alternative data-[focus]:text-background"
                      >
                        Admin
                      </Link>
                    </MenuItem>
                  )}

                  <MenuItem>
                    <button
                      className="cursor-pointer flex items-center gap-2 w-full px-4 pt-2.5 pb-2 text-sm data-[focus]:bg-alternative data-[focus]:text-background"
                      onClick={() => signOut()}
                    >
                      <SignOut size={20} weight="bold" />
                      <span className="hidden text-sm md:flex">
                        {t("logout")}
                      </span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <button
                className="cursor-pointer bg-accent hover:bg-accent/75 duration-150 px-4 py-2 rounded-md"
                onClick={() => signIn("google")}
              >
                <SignIn className="flex md:hidden" size={20} weight="bold" />
                <span className="hidden text-sm md:flex">{t("login")}</span>
              </button>
            )} */}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center lg:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">{t("openMainMenu")}</span>
              <List
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <X
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
        </header>
      </MaxWidthWrapper>

      {/* Mobile Menu */}
      <DisclosurePanel className="lg:hidden h-page">
        <div className="space-y-1 py-6">
          {navigationLinks.map((link) => (
            <DisclosureButton
              key={link.tradKey}
              as={Link}
              href={link.url}
              className={cn(
                "block w-full border-l-4 py-3 pl-3 pr-4 text-base font-medium",
                pathname === link.url
                  ? "border-accent text-accent"
                  : "border-transparent"
              )}
            >
              {t(`navigation.${link.tradKey}`)}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
