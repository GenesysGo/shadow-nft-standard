import { Fragment } from "react"
import Link from "next/link"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/20/solid"
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline"

import { siteConfig } from "@/config/site"

import { Icons } from "./icons"
import { MainNav } from "./main-nav"
import { ThemeToggle } from "./theme-toggle"
import { buttonVariants } from "./ui/button"
import ConnectWalletButton from "./ui/connect-wallet-button"

export function SiteHeader() {
  return (
    <Disclosure
      as="nav"
      className="bg-background sticky top-0 z-40 w-full border-b"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="focus:ring-primary inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden md:flex">
                  <Link
                    href="/"
                    passHref
                    className="flex items-center justify-center"
                  >
                    <span className="flex items-center space-x-2">
                      <Icons.logo className="h-6 w-6" />
                      <span className="inline-block font-bold">
                        {siteConfig.name}
                      </span>
                    </span>
                  </Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <MainNav items={siteConfig.mainNav} />
                </div>
              </div>
              <div className="flex items-center">
                <div className="shrink-0">
                  <ConnectWalletButton />
                </div>
                <div className="shrink-0">
                  <Link
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      <Icons.gitHub className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </div>
                  </Link>
                </div>
                <div className="shrink-0">
                  <Link
                    href={siteConfig.links.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      <Icons.twitter className="h-5 w-5 fill-current" />
                      <span className="sr-only">Twitter</span>
                    </div>
                  </Link>
                </div>
                <div className="shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/mint"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Mint
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/create"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Create
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/wallet"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                View NFTs
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/manage-collections"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Manage Collections
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/manage-creator-groups"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Manage Creator Groups
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
