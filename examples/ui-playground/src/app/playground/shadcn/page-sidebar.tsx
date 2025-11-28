'use client'
import React, { useEffect, useState } from 'react'

import { MagnifyingGlassIcon, SidebarSimpleIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupControl,
  InputGroupText,
  linkVariants,
} from '@genseki/ui'

const navigationItems = [
  { href: '#button', label: 'Button' },
  { href: '#combobox', label: 'Combobox' },
  { href: '#checkbox', label: 'Checkbox' },
  { href: '#color-picker', label: 'Color picker' },
  { href: '#date-picker', label: 'Date picker' },
  { href: '#drop-zone', label: 'Drop zone' },
  { href: '#dialog', label: 'Dialog' },
  { href: '#input', label: 'Input' },
  { href: '#input-otp', label: 'Input OTP' },
  { href: '#link', label: 'Link' },
  { href: '#pagination', label: 'Pagination' },
  { href: '#progress', label: 'Progress' },
  { href: '#separator', label: 'Separator' },
  { href: '#select', label: 'Select' },
  { href: '#slider', label: 'Slider' },
  { href: '#switch', label: 'Switch' },
  { href: '#table', label: 'Table' },
  { href: '/playground/shadcn/table', label: 'Table (page)' },
  { href: '#tabs', label: 'Tabs' },
  { href: '#tooltip', label: 'Tooltip' },
  { href: '#dropdown-menu', label: 'Dropdown Menu' },
  { href: '#collapsible', label: 'Collapsible' },
  { href: '#toggle', label: 'Toggle' },
  { href: '#toggle-group', label: 'Toggle Group' },
  { href: '#textarea', label: 'Textarea' },
  { href: '#toast', label: 'Toast' },
  { href: '#radio-group', label: 'Radio group' },
  { href: '#rich-text-editor', label: 'Rich Text Editor' },
  { href: '#collection-card', label: 'Collection Card' },
  { href: '/playground/shadcn/sidebar', label: 'Sidebar' },
]

const PageSidebar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(searchParams.get('sidebar-open') === 'true')
  const [search, setSearch] = React.useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchParams.get('search') || '')

  const setIsSidebarOpen = (open: boolean) => {
    setIsOpen(open)
    const url = new URL(window.location.href)
    url.searchParams.set('sidebar-open', String(open))
    router.replace(url.href)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      const url = new URL(window.location.href)

      !search ? url.searchParams.delete('search') : url.searchParams.set('search', search)

      router.replace(url.toString())
    }, 200)

    return () => clearTimeout(timeout)
  }, [search, pathname, router])

  const filteredItems = React.useMemo(() => {
    return navigationItems.filter((item) =>
      item.label.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch])

  return (
    <>
      {!isOpen ? (
        <div className="fixed top-4 right-4">
          <Button size="icon" variant="outline" onClick={() => setIsSidebarOpen(true)}>
            <SidebarSimpleIcon />
          </Button>
        </div>
      ) : (
        <div className="relative bg-card border-l border-border overflow-clip w-[240px]">
          <div className="sticky inset-0 max-h-screen overflow-auto [overscroll-behavior:none]">
            <div className="w-full p-6 sticky items-center top-0 bg-background border-b flex gap-x-2">
              <Button size="icon" variant="outline" onClick={() => setIsSidebarOpen(false)}>
                <SidebarSimpleIcon />
              </Button>
              <InputGroup className="overflow-clip">
                <InputGroupAddon>
                  <InputGroupText>
                    <MagnifyingGlassIcon />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupControl>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search components..."
                    className="bg-background"
                  />
                </InputGroupControl>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-y-0 p-6">
              {filteredItems.map((item) => (
                <React.Fragment key={item.href}>
                  <Link
                    href={item.href}
                    className={linkVariants({
                      className:
                        'text-text-secondary hover:bg-secondary py-2 px-4 rounded focus-visible:ring-ring focus-visible:ring-[2px] outline-none',
                      variant: 'plain',
                    })}
                  >
                    {'>'} {item.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PageSidebar
