'use client'

import { IconGallery, IconGrid4, IconLink, IconRedo, IconUndo } from '@intentui/icons'
import {
  CaretDownIcon,
  DiscordLogoIcon,
  GithubLogoIcon,
  PlusCircleIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'

import { Editor } from '../components/editor'
import { PlaygroundCard } from '../components/playground/card'
import { BaseIcon } from '../components/primitives/base-icon'
import { IconContainer } from '../components/primitives/icon-container'
import { Typography } from '../components/primitives/typography'
import { Button } from '../intentui/ui/button'
import { Calendar } from '../intentui/ui/calendar'
import { Checkbox, CheckboxGroup } from '../intentui/ui/checkbox'
import { DateField } from '../intentui/ui/date-field'
import { DatePicker } from '../intentui/ui/date-picker'
import { Link } from '../intentui/ui/link'
import { ListBox, ListBoxItem, ListBoxItemDetails, ListBoxSection } from '../intentui/ui/list-box'
import { Menu, MenuContent, MenuItem } from '../intentui/ui/menu'
import {
  Popover,
  PopoverBody,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../intentui/ui/popover'
import { RangeCalendar } from '../intentui/ui/range-calendar'
import {
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
} from '../intentui/ui/select'
import { Switch } from '../intentui/ui/switch'
import { TextField } from '../intentui/ui/text-field'
import { TimeField } from '../intentui/ui/time-field'
import { ToggleGroup } from '../intentui/ui/toggle'
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator } from '../intentui/ui/toolbar'

const Wrapper = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <Typography type="h4" weight="semibold" className="text-text-nontrivial">
        {title}
      </Typography>
      {children}
    </div>
  )
}

const MOCK_OPTIONS = [
  { id: 1, name: 'Admin', description: 'Has full access to all resources' },
  { id: 2, name: 'Editor', description: 'Can edit content but has limited access to settings' },
  { id: 3, name: 'Viewer', description: 'Can view content but cannot make changes' },
  { id: 4, name: 'Contributor', description: 'Can contribute content for review' },
  { id: 5, name: 'Guest', description: 'Limited access, mostly for viewing purposes' },
]
const countries = [
  {
    id: 1,
    name: 'Egypt',
    cities: [
      {
        id: 101,
        name: 'Cairo',
      },
      {
        id: 102,
        name: 'Alexandria',
      },
      {
        id: 103,
        name: 'Giza',
      },
      {
        id: 104,
        name: 'Luxor',
      },
    ],
  },
  {
    id: 2,
    name: 'Indonesia',
    cities: [
      {
        id: 201,
        name: 'Jakarta',
      },
      {
        id: 202,
        name: 'Bali',
      },
      {
        id: 203,
        name: 'Surabaya',
      },
      {
        id: 204,
        name: 'Bandung',
      },
      {
        id: 205,
        name: 'Medan',
      },
    ],
  },
  {
    id: 3,
    name: 'United States',
    cities: [
      {
        id: 301,
        name: 'New York City',
      },
      {
        id: 302,
        name: 'Los Angeles',
      },
      {
        id: 303,
        name: 'Chicago',
      },
      {
        id: 304,
        name: 'Houston',
      },
    ],
  },
  {
    id: 4,
    name: 'Canada',
    cities: [
      {
        id: 401,
        name: 'Toronto',
      },
      {
        id: 402,
        name: 'Vancouver',
      },
      {
        id: 403,
        name: 'Montreal',
      },
    ],
  },
  {
    id: 5,
    name: 'Australia',
    cities: [
      {
        id: 501,
        name: 'Sydney',
      },
      {
        id: 502,
        name: 'Melbourne',
      },
      {
        id: 503,
        name: 'Brisbane',
      },
    ],
  },
  {
    id: 6,
    name: 'Germany',
    cities: [
      {
        id: 601,
        name: 'Berlin',
      },
      {
        id: 602,
        name: 'Munich',
      },
      {
        id: 603,
        name: 'Frankfurt',
      },
      {
        id: 604,
        name: 'Hamburg',
      },
    ],
  },
  {
    id: 7,
    name: 'Japan',
    cities: [
      {
        id: 701,
        name: 'Tokyo',
      },
      {
        id: 702,
        name: 'Osaka',
      },
      {
        id: 703,
        name: 'Kyoto',
      },
    ],
  },
]

export const UIPlayground = () => {
  return (
    <div className="bg-bg pb-24">
      <Wrapper title="Theme playground">
        <PlaygroundCard title="Theme playground" categoryTitle="Theme playground">
          <div className="bg-bg border-border rounded-sm border px-8 py-4">
            <Typography type="body" weight="normal" className="text-fg">
              Background: --color-bg | Foreground: --color-fg
            </Typography>
          </div>
          <div className="bg-primary border-primary-emphasis rounded-sm border px-8 py-4">
            <Typography type="body" weight="normal" className="text-primary-fg">
              Background: --color-primary | Foreground: --color-primary-fg | border:
              --color-primary-emphasis
            </Typography>
          </div>
          <div className="bg-secondary border-border rounded-sm border px-8 py-4">
            <Typography type="body" weight="normal" className="text-secondary-fg">
              Background: --color-secondary | Foreground: --color-secondary-fg
            </Typography>
          </div>
          <div className="bg-accent border-accent rounded-sm border px-8 py-4">
            <Typography type="body" weight="normal" className="text-accent-fg">
              Background: --color-accent | Foreground: --color-accent-fg
            </Typography>
          </div>
          <div className="bg-muted border-border rounded-sm border px-8 py-4">
            <Typography type="body" weight="normal" className="text-muted-fg">
              Background: --color-muted | Foreground: --color-muted-fg
            </Typography>
          </div>
        </PlaygroundCard>
      </Wrapper>
      <Wrapper title="Toolbar">
        <div className="flex justify-center">
          <Toolbar aria-label="Toolbars" className="flex items-center">
            <ToolbarGroup aria-label="Text Formatting Options" className="flex items-center">
              <ToggleGroup size="md">
                <ToolbarItem defaultSelected aria-label="Bold" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextBIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextBIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
                <ToolbarItem aria-label="Italic" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextItalicIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextItalicIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
                <ToolbarItem aria-label="Underline" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextUnderlineIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextUnderlineIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
                <ToolbarItem aria-label="Strikethrough" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextStrikethroughIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextStrikethroughIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
              </ToggleGroup>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup aria-label="Alignment" className="flex items-center">
              <ToggleGroup selectionMode="single">
                <ToolbarItem id="0" aria-label="Align Left" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextAlignLeftIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextAlignLeftIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
                <ToolbarItem id="1" aria-label="Align Center" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextAlignCenterIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextAlignCenterIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
                <ToolbarItem id="2" aria-label="Align Right" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextAlignRightIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextAlignRightIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
                <ToolbarItem id="3" aria-label="Align Justify" intent="outline">
                  {({ isSelected }) => (
                    <>
                      {isSelected ? (
                        <BaseIcon icon={TextAlignJustifyIcon} size="md" weight="bold" />
                      ) : (
                        <BaseIcon icon={TextAlignJustifyIcon} size="md" weight="regular" />
                      )}
                    </>
                  )}
                </ToolbarItem>
              </ToggleGroup>
            </ToolbarGroup>
            <ToolbarSeparator />
            <Checkbox>Spell Check</Checkbox>
            <ToolbarGroup className="ml-auto">
              <Menu>
                <Button aria-label="Other options" variant="ghost" size="md">
                  Options
                  <BaseIcon icon={CaretDownIcon} size="md" weight="regular" />
                </Button>
                <MenuContent showArrow placement="bottom right">
                  <MenuItem>
                    <IconUndo />
                    Undo
                  </MenuItem>
                  <MenuItem>
                    <IconRedo />
                    Redo
                  </MenuItem>
                  <MenuItem>
                    <IconLink />
                    Insert Link
                  </MenuItem>
                  <MenuItem>
                    <IconGallery />
                    Insert Image
                  </MenuItem>
                  <MenuItem>
                    <IconGrid4 />
                    Insert Grid
                  </MenuItem>
                </MenuContent>
              </Menu>
            </ToolbarGroup>
          </Toolbar>
        </div>
      </Wrapper>
      <Wrapper title="Rich text">
        <Editor />
      </Wrapper>
      <Wrapper title="Date picker">
        <div className="flex justify-start">
          <TimeField label="Time to wake up" description="Select the time you want to wake up" />
        </div>
      </Wrapper>
      <Wrapper title="Date picker">
        <div className="flex justify-start">
          <DatePicker description="Select your birth date" label="Your birth date" isRequired />
        </div>
      </Wrapper>
      <Wrapper title="Range calendar">
        <div className="flex justify-start">
          <RangeCalendar />
        </div>
      </Wrapper>
      <Wrapper title="Date field">
        <div className="flex">
          <DateField label="Date of birth" size="md" isRequired />
        </div>
      </Wrapper>
      <Wrapper title="Calendar">
        <div className="w-full flex">
          <Calendar aria-label="Event date" />
        </div>
      </Wrapper>
      <Wrapper title="Popover">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Popover (Form)" categoryTitle="Popover">
            <Popover>
              <Button variant="primary" size="md">
                Login
              </Button>
              <PopoverContent className="sm:min-w-96">
                <PopoverHeader>
                  <PopoverTitle>Login</PopoverTitle>
                  <PopoverDescription>Enter your credentials to sign in.</PopoverDescription>
                </PopoverHeader>
                <form onSubmit={() => {}} className="w-[400px]">
                  <PopoverBody>
                    <div className="space-y-4">
                      <TextField
                        autoFocus
                        isRequired
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                      />
                      <TextField
                        isRequired
                        isRevealable
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                      />
                      <div className="my-4 flex items-center justify-between">
                        <Checkbox name="remember-me">Remember me</Checkbox>
                        <Link className="text-sm" href="#">
                          Forgot password?
                        </Link>
                      </div>
                      <div>
                        <CheckboxGroup
                          name="settings"
                          label="Settings"
                          description="Select the permissions you want to grant to the user."
                        >
                          <Checkbox value="read">Read</Checkbox>
                          <Checkbox value="write">Write</Checkbox>
                          <Checkbox value="delete">Delete</Checkbox>
                          <Checkbox value="admin">Admin</Checkbox>
                        </CheckboxGroup>
                      </div>
                    </div>
                  </PopoverBody>
                  <PopoverFooter>
                    <PopoverClose variant="outline" size="sm">
                      Cancel
                    </PopoverClose>
                    <Button type="submit" variant="tertiary" size="sm">
                      Login
                    </Button>
                  </PopoverFooter>
                </form>
              </PopoverContent>
            </Popover>
          </PlaygroundCard>
          <PlaygroundCard title="Popover (normal)" categoryTitle="Popover">
            <Popover>
              <PopoverTrigger>Open Popover</PopoverTrigger>
              <PopoverContent className="sm:min-w-72">
                <PopoverHeader>
                  <PopoverTitle level={4}>Popover Title</PopoverTitle>
                  <PopoverDescription>
                    Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Quos, temporibus.
                  </PopoverDescription>
                </PopoverHeader>
                <PopoverBody>
                  Popover Body | Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Quos, temporibus.
                </PopoverBody>
                <PopoverFooter>
                  <PopoverClose size="sm" variant="outline">
                    Close
                  </PopoverClose>
                  <PopoverClose size="sm" variant="secondary">
                    Confirm
                  </PopoverClose>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Listbox">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Listbox (normal)" categoryTitle="Listbox">
            <ListBox items={MOCK_OPTIONS} selectionMode="single" aria-label="Bands">
              {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
            </ListBox>
          </PlaygroundCard>
          <PlaygroundCard title="Listbox (multiple selection)" categoryTitle="Listbox">
            <ListBox items={MOCK_OPTIONS} selectionMode="multiple" aria-label="Bands">
              {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
            </ListBox>
          </PlaygroundCard>
          <PlaygroundCard title="Listbox (Description)" categoryTitle="Listbox">
            <ListBox selectedKeys={[]} items={MOCK_OPTIONS} aria-label="Bands">
              {(item) => (
                <ListBoxItem id={item.id} textValue={item.name}>
                  <ListBoxItemDetails label={item.name} description={item.description} />
                </ListBoxItem>
              )}
            </ListBox>
          </PlaygroundCard>
          <PlaygroundCard title="Listbox (Section)" categoryTitle="Listbox">
            <ListBox items={countries} aria-label="Bands" selectionMode="multiple">
              {(country) => (
                <ListBoxSection items={country.cities} title={country.name} id={country.id}>
                  {(country: any) => <ListBoxItem id={country.id}>{country.name}</ListBoxItem>}
                </ListBoxSection>
              )}
            </ListBox>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Dropdown">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Dropdown (normal)" categoryTitle="Dropdown">
            <Select>
              <SelectTrigger />
              <SelectList items={MOCK_OPTIONS}>
                {(item) => (
                  <SelectOption id={item.id} textValue={item.name}>
                    {item.name}
                  </SelectOption>
                )}
              </SelectList>
            </Select>
          </PlaygroundCard>
          <PlaygroundCard title="Dropdown (group section)" categoryTitle="Dropdown">
            <Select defaultSelectedKey={1} aria-label="Countries" placeholder="Select a country">
              <SelectTrigger />
              <SelectList items={countries}>
                {(country) => (
                  <SelectSection title={country.name} items={country.cities}>
                    {(city: any) => <SelectOption textValue={city.name}>{city.name}</SelectOption>}
                  </SelectSection>
                )}
              </SelectList>
            </Select>
          </PlaygroundCard>
          <PlaygroundCard title="Dropdown (icon)" categoryTitle="Dropdown">
            <Select aria-label="Devices" defaultSelectedKey="desktop" placeholder="Select a device">
              <SelectTrigger />
              <SelectList>
                <SelectOption isDisabled id="discord" textValue="Discord">
                  <BaseIcon icon={DiscordLogoIcon} size="md" />
                  <SelectLabel>Discord</SelectLabel>
                </SelectOption>
                <SelectSeparator />
                <SelectOption id="github" textValue="GitHub">
                  <BaseIcon icon={GithubLogoIcon} size="md" />
                  <SelectLabel>GitHub</SelectLabel>
                </SelectOption>
                <SelectOption id="gitlab" textValue="GitLab">
                  GitLab
                </SelectOption>
              </SelectList>
            </Select>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Typography">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Label" categoryTitle="Typography">
            <ul>
              <li>
                <Typography type="label" weight="normal">
                  Label/regular
                </Typography>
              </li>
              <li>
                <Typography type="label" weight="medium">
                  Label/medium
                </Typography>
              </li>
              <li>
                <Typography type="label" weight="semibold">
                  Label/semibold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
          <PlaygroundCard title="Caption" categoryTitle="Typography">
            <ul className="">
              <li>
                <Typography type="caption" weight="normal">
                  Caption/regular
                </Typography>
              </li>
              <li>
                <Typography type="caption" weight="medium">
                  Caption/medium
                </Typography>
              </li>
              <li>
                <Typography type="caption" weight="semibold">
                  Caption/semibold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
          <PlaygroundCard title="Body" categoryTitle="Typography">
            <ul className="">
              <li>
                <Typography type="body" weight="normal">
                  Body/regular
                </Typography>
              </li>
              <li>
                <Typography type="body" weight="medium">
                  Body/medium
                </Typography>
              </li>
              <li>
                <Typography type="body" weight="semibold">
                  Body/semibold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
          <PlaygroundCard title="h4" categoryTitle="Typography">
            <ul className="">
              <li>
                <Typography type="h4" weight="normal">
                  h4/regular
                </Typography>
              </li>
              <li>
                <Typography type="h4" weight="medium">
                  h4/medium
                </Typography>
              </li>
              <li>
                <Typography type="h4" weight="semibold">
                  h4/semibold
                </Typography>
              </li>
              <li>
                <Typography type="h4" weight="bold">
                  h4/bold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
          <PlaygroundCard title="h3" categoryTitle="Typography">
            <ul className="">
              <li>
                <Typography type="h3" weight="normal">
                  h3/regular
                </Typography>
              </li>
              <li>
                <Typography type="h3" weight="medium">
                  h3/medium
                </Typography>
              </li>
              <li>
                <Typography type="h3" weight="semibold">
                  h3/semibold
                </Typography>
              </li>
              <li>
                <Typography type="h3" weight="bold">
                  h3/bold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
          <PlaygroundCard title="h2" categoryTitle="Typography">
            <ul className="">
              <li>
                <Typography type="h2" weight="normal">
                  h2/regular
                </Typography>
              </li>
              <li>
                <Typography type="h2" weight="medium">
                  h2/medium
                </Typography>
              </li>
              <li>
                <Typography type="h2" weight="semibold">
                  h2/semibold
                </Typography>
              </li>
              <li>
                <Typography type="h2" weight="bold">
                  h2/bold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
          <PlaygroundCard title="h1" categoryTitle="Typography">
            <ul className="">
              <li>
                <Typography type="h1" weight="normal">
                  h1/regular
                </Typography>
              </li>
              <li>
                <Typography type="h1" weight="medium">
                  h1/medium
                </Typography>
              </li>
              <li>
                <Typography type="h1" weight="semibold">
                  h1/semibold
                </Typography>
              </li>
              <li>
                <Typography type="h1" weight="bold">
                  h1/bold
                </Typography>
              </li>
            </ul>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Textfield">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Medium size (md)" categoryTitle="Button">
            <div className="flex flex-col space-y-4">
              <Switch onChange={() => {}} />
              <TextField
                isRequired={false}
                label="Package owner"
                description="This is a helper text"
                size="md"
                isDisabled
                placeholder="Data"
              />

              <TextField
                isRequired
                type="password"
                label="Package name"
                isRevealable
                description="This is a helper text"
                size="md"
              />
              <TextField
                isRequired
                label="Package name"
                type="text"
                description="This is a helper text"
                size="md"
                prefix={<BaseIcon icon={PlusCircleIcon} size="md" />}
              />
              <TextField
                isRequired
                label="Package name"
                type="text"
                description="This is a helper text"
                size="md"
                suffix={<BaseIcon icon={PlusCircleIcon} size="md" />}
              />
              <TextField type="text" size="md" />
              <TextField
                type="text"
                size="sm"
                prefix={
                  <div className="bg-secondary rounded-sm p-2">
                    <Typography type="caption" className="text-secondary-fg" weight="normal">
                      Prefix
                    </Typography>
                  </div>
                }
                suffix={
                  <div className="bg-secondary rounded-sm p-2">
                    <Typography type="caption" className="text-secondary-fg" weight="normal">
                      Suffix
                    </Typography>
                  </div>
                }
              />
              <TextField
                type="text"
                description="lorem"
                size="xs"
                prefix={'MR.'}
                suffix={'Right?'}
              />
            </div>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Button">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Medium size (md)" categoryTitle="Button">
            <div className="flex w-full flex-col items-start gap-y-3">
              <Button
                variant="primary"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                TESTER
              </Button>
              <Button
                variant="primary"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Primary
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Secondary
              </Button>
              <Button
                variant="tertiary"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Tertiary
              </Button>
              <Button
                variant="naked"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Naked
              </Button>
              <Button
                variant="outline"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Outline
              </Button>
              <Button
                variant="ghost"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Ghost
              </Button>
              <Button
                variant="destruction"
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
                size="md"
              >
                Destruction
              </Button>
            </div>
          </PlaygroundCard>
          <PlaygroundCard title="Small size (sm)" categoryTitle="Button">
            <div className="flex flex-col items-start gap-y-3">
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="primary"
                size="sm"
              >
                Primary
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="secondary"
                size="sm"
              >
                Secondary
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="tertiary"
                size="sm"
              >
                Tertiary
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="naked"
                size="sm"
              >
                Naked
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="outline"
                size="sm"
              >
                Outline
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="ghost"
                size="sm"
              >
                Ghost
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="destruction"
                size="sm"
              >
                Destruction
              </Button>
            </div>
          </PlaygroundCard>
          <PlaygroundCard title="Extra small size (xs)" categoryTitle="Button">
            <div className="flex flex-col items-start gap-y-3">
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="primary"
                size="xs"
              >
                Primary
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="secondary"
                size="xs"
              >
                Secondary
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="tertiary"
                size="xs"
              >
                Tertiary
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="naked"
                size="xs"
              >
                Naked
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="outline"
                size="xs"
              >
                Outline
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="ghost"
                size="xs"
              >
                Ghost
              </Button>
              <Button
                leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
                variant="destruction"
                size="xs"
              >
                Destruction
              </Button>
            </div>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Icon button">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          <PlaygroundCard title="Medium size (md)" categoryTitle="Button">
            <div className="flex w-full flex-col items-start gap-y-3">
              <Button variant="primary" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
              <Button variant="secondary" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
              <Button variant="tertiary" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
              <Button variant="naked" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
              <Button variant="outline" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
              <Button variant="ghost" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
              <Button variant="destruction" size="md">
                <BaseIcon icon={PlusCircleIcon} size="md" />
              </Button>
            </div>
          </PlaygroundCard>
          <PlaygroundCard title="Medium size (sm)" categoryTitle="Button">
            <div className="flex w-full flex-col items-start gap-y-3">
              <Button variant="primary" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="secondary" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="tertiary" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="naked" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="outline" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="ghost" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="destruction" size="sm">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
            </div>
          </PlaygroundCard>
          <PlaygroundCard title="Extra small size (xs)" categoryTitle="Button">
            <div className="flex w-full flex-col items-start gap-y-3">
              <Button variant="primary" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="secondary" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="tertiary" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="naked" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="outline" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="ghost" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="destruction" size="xs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
            </div>
          </PlaygroundCard>
          <PlaygroundCard title="Double extra small size (xxs)" categoryTitle="Button">
            <div className="flex w-full flex-col items-start gap-y-3">
              <Button variant="primary" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="secondary" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="tertiary" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="naked" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="outline" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="ghost" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
              <Button variant="destruction" size="xxs">
                <BaseIcon icon={PlusCircleIcon} size="sm" />
              </Button>
            </div>
          </PlaygroundCard>
        </div>
      </Wrapper>
      <Wrapper title="Icon">
        <PlaygroundCard title="Medium size (md)" categoryTitle="Base icon">
          <div className="flex items-center gap-x-4">
            <IconContainer
              size="sm"
              variant="normal"
              icon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
            />
            <IconContainer
              size="sm"
              variant="soft-shadow"
              icon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
            />
            <IconContainer
              size="sm"
              variant="ghost"
              icon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
            />
          </div>
          <div className="flex items-center gap-x-4">
            <IconContainer
              size="xs"
              variant="normal"
              icon={<BaseIcon icon={UserCircleIcon} size="xs" />}
            />
            <IconContainer
              size="xs"
              variant="soft-shadow"
              icon={<BaseIcon icon={PlusCircleIcon} size="xs" />}
            />
            <IconContainer
              size="xs"
              variant="ghost"
              icon={<BaseIcon icon={PlusCircleIcon} size="xs" />}
            />
          </div>
        </PlaygroundCard>
      </Wrapper>
      <Wrapper title="Base icon">
        <PlaygroundCard title="Medium size (md)" categoryTitle="Base icon">
          <div className="flex items-center gap-x-4">
            <div className="flex items-center">
              <BaseIcon icon={PlusCircleIcon} size="xl" />
              <Typography type="label" weight="semibold">
                xl
              </Typography>
            </div>
            <div className="flex items-center">
              <BaseIcon icon={PlusCircleIcon} size="lg" />
              <Typography type="label" weight="semibold">
                lg
              </Typography>
            </div>
            <div className="flex items-center">
              <BaseIcon icon={PlusCircleIcon} size="md" />
              <Typography type="label" weight="semibold">
                md
              </Typography>
            </div>
            <div className="flex items-center">
              <BaseIcon icon={PlusCircleIcon} size="sm" />
              <Typography type="label" weight="semibold">
                sm
              </Typography>
            </div>
            <div className="flex items-center">
              <BaseIcon icon={PlusCircleIcon} size="xs" />
              <Typography type="label" weight="semibold">
                xs
              </Typography>
            </div>
          </div>
        </PlaygroundCard>
      </Wrapper>
    </div>
  )
}
