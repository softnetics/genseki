// 'use client'

// import { Suspense, useState } from 'react'

// import { IconGallery, IconGrid4, IconLink, IconRedo, IconUndo } from '@intentui/icons'
// import {
//   CaretDownIcon,
//   DiscordLogoIcon,
//   GithubLogoIcon,
//   MagnifyingGlassIcon,
//   PlusCircleIcon,
//   TextAlignCenterIcon,
//   TextAlignJustifyIcon,
//   TextAlignLeftIcon,
//   TextAlignRightIcon,
//   TextBIcon,
//   TextItalicIcon,
//   TextStrikethroughIcon,
//   TextUnderlineIcon,
//   TrashIcon,
// } from '@phosphor-icons/react'
// import { StarterKit } from '@tiptap/starter-kit'
// import { useTheme } from 'next-themes'

// import {
//   Annotation,
//   Avatar,
//   Breadcrumbs,
//   BreadcrumbsItem,
//   ButtonGroup,
//   ButtonGroupItem,
//   Card,
//   Link,
//   PageSizeSelect,
//   Pagination,
//   ProgressBar,
//   Radio,
//   RadioGroup,
//   ReorderGroup,
//   Switch,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TabList,
//   Tabs,
//   Tag,
//   TagGroup,
//   TagList,
//   Textarea,
//   TextField,
//   TimeField,
//   ToggleGroup,
//   Toolbar,
//   ToolbarGroup,
//   ToolbarItem,
//   ToolbarSeparator,
//   Tooltip,
//   TooltipContent,
// } from '@genseki/react'
// import { RichTextEditor } from '@genseki/react'
// import { BaseIcon } from '@genseki/react'
// import { Typography } from '@genseki/react'
// import { Badge } from '@genseki/react'
// import { Button } from '@genseki/react'
// import { Calendar } from '@genseki/react'
// import { Checkbox, CheckboxGroup } from '@genseki/react'
// import { ColorField } from '@genseki/react'
// import { ColorPicker } from '@genseki/react'
// import { DateField } from '@genseki/react'
// import { DatePicker } from '@genseki/react'
// import { ListBox, ListBoxItem, ListBoxItemDetails, ListBoxSection } from '@genseki/react'
// import { Menu, MenuContent, MenuItem } from '@genseki/react'
// import {
//   Modal,
//   ModalBody,
//   ModalClose,
//   ModalContent,
//   ModalDescription,
//   ModalFooter,
//   ModalHeader,
//   ModalTitle,
//   ModalTrigger,
// } from '@genseki/react'
// import { MultipleSelect, MultipleSelectItem } from '@genseki/react'
// import {
//   Popover,
//   PopoverBody,
//   PopoverClose,
//   PopoverContent,
//   PopoverDescription,
//   PopoverFooter,
//   PopoverHeader,
//   PopoverTitle,
// } from '@genseki/react'
// import { RangeCalendar } from '@genseki/react'
// import {
//   Select,
//   SelectLabel,
//   SelectList,
//   SelectOption,
//   SelectSection,
//   SelectSeparator,
//   SelectTrigger,
// } from '@genseki/react'

// import { PlaygroundCard } from '../../components/card'
// import { Wrapper } from '../../components/wrapper'

// const MOCK_OPTIONS = [
//   { id: 1, name: 'Admin', description: 'Has full access to all resources' },
//   { id: 2, name: 'Editor', description: 'Can edit content but has limited access to settings' },
//   { id: 3, name: 'Viewer', description: 'Can view content but cannot make changes' },
//   { id: 4, name: 'Contributor', description: 'Can contribute content for review' },
//   { id: 5, name: 'Guest', description: 'Limited access, mostly for viewing purposes' },
// ]
// const fruits = [
//   { id: 1, name: 'Apple' },
//   { id: 2, name: 'Banana' },
//   { id: 3, name: 'Cherry' },
//   { id: 4, name: 'Date' },
//   { id: 5, name: 'Elderberry' },
//   { id: 6, name: 'Fig' },
//   { id: 7, name: 'Grape' },
//   { id: 8, name: 'Honeydew' },
//   { id: 9, name: 'Kiwi' },
//   { id: 10, name: 'Lemon' },
//   { id: 11, name: 'Mango' },
//   { id: 12, name: 'Nectarine' },
//   { id: 13, name: 'Orange' },
//   { id: 14, name: 'Papaya' },
//   { id: 15, name: 'Quince' },
//   { id: 16, name: 'Raspberry' },
//   { id: 17, name: 'Strawberry' },
//   { id: 18, name: 'Tangerine' },
//   { id: 19, name: 'Ugli Fruit' },
//   { id: 20, name: 'Watermelon' },
// ]

// const countries = [
//   {
//     id: 1,
//     name: 'Egypt',
//     cities: [
//       {
//         id: 101,
//         name: 'Cairo',
//       },
//       {
//         id: 102,
//         name: 'Alexandria',
//       },
//       {
//         id: 103,
//         name: 'Giza',
//       },
//       {
//         id: 104,
//         name: 'Luxor',
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Indonesia',
//     cities: [
//       {
//         id: 201,
//         name: 'Jakarta',
//       },
//       {
//         id: 202,
//         name: 'Bali',
//       },
//       {
//         id: 203,
//         name: 'Surabaya',
//       },
//       {
//         id: 204,
//         name: 'Bandung',
//       },
//       {
//         id: 205,
//         name: 'Medan',
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: 'United States',
//     cities: [
//       {
//         id: 301,
//         name: 'New York City',
//       },
//       {
//         id: 302,
//         name: 'Los Angeles',
//       },
//       {
//         id: 303,
//         name: 'Chicago',
//       },
//       {
//         id: 304,
//         name: 'Houston',
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: 'Canada',
//     cities: [
//       {
//         id: 401,
//         name: 'Toronto',
//       },
//       {
//         id: 402,
//         name: 'Vancouver',
//       },
//       {
//         id: 403,
//         name: 'Montreal',
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: 'Australia',
//     cities: [
//       {
//         id: 501,
//         name: 'Sydney',
//       },
//       {
//         id: 502,
//         name: 'Melbourne',
//       },
//       {
//         id: 503,
//         name: 'Brisbane',
//       },
//     ],
//   },
//   {
//     id: 6,
//     name: 'Germany',
//     cities: [
//       {
//         id: 601,
//         name: 'Berlin',
//       },
//       {
//         id: 602,
//         name: 'Munich',
//       },
//       {
//         id: 603,
//         name: 'Frankfurt',
//       },
//       {
//         id: 604,
//         name: 'Hamburg',
//       },
//     ],
//   },
//   {
//     id: 7,
//     name: 'Japan',
//     cities: [
//       {
//         id: 701,
//         name: 'Tokyo',
//       },
//       {
//         id: 702,
//         name: 'Osaka',
//       },
//       {
//         id: 703,
//         name: 'Kyoto',
//       },
//     ],
//   },
// ]

// interface ReorderMockData {
//   id: string
//   text: string
// }

// const mockDataReorder: ReorderMockData[] = [
//   { id: 'id1', text: 'Button 1' },
//   { id: 'id2', text: 'Button 2' },
//   { id: 'id3', text: 'Button 3' },
//   { id: 'id4', text: 'Button 4' },
//   { id: 'id5', text: 'Button 5' },
// ]

// export default function UIPlayground() {
//   const { setTheme, theme } = useTheme()
//   const [btnData, setBtnData] = useState<ReorderMockData[]>(mockDataReorder)

//   // Map new order
//   const handleReorder = (newOrder: string[]) => {
//     setBtnData((prev) => {
//       const map = new Map(prev.map((item) => [item.id, item]))
//       return newOrder.map((id) => map.get(id)).filter((b): b is ReorderMockData => Boolean(b))
//     })
//   }

//   return (
//     <div className="bg-white pb-24 relative dark:bg-black">
//       <div className="fixed top-6 right-6 z-50">
//         <Button
//           variant={'secondary'}
//           size="md"
//           onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//         >
//           {theme === 'dark' ? 'Light' : 'Dark'}
//         </Button>
//       </div>
//       <Wrapper title="Theme playground">
//         <PlaygroundCard title="Theme playground" categoryTitle="Theme playground">
//           <div className="bg-bg border-border rounded-sm border px-8 py-4">
//             <Typography type="body" weight="normal" className="text-fg">
//               Background: --color-bg | Foreground: --color-fg
//             </Typography>
//           </div>
//           <div className="bg-primary border-primary rounded-sm border px-8 py-4">
//             <Typography type="body" weight="normal" className="text-primary-fg">
//               Background: --color-primary | Foreground: --color-primary-fg | border: --color-primary
//             </Typography>
//           </div>
//           <div className="bg-secondary border-border rounded-sm border px-8 py-4">
//             <Typography type="body" weight="normal" className="text-secondary-fg">
//               Background: --color-secondary | Foreground: --color-secondary-fg
//             </Typography>
//           </div>
//           <div className="bg-accent border-accent rounded-sm border px-8 py-4">
//             <Typography type="body" weight="normal" className="text-accent-fg">
//               Background: --color-accent | Foreground: --color-accent-fg
//             </Typography>
//           </div>
//           <div className="bg-muted border-border rounded-sm border px-8 py-4">
//             <Typography type="body" weight="normal" className="text-muted-fg">
//               Background: --color-muted | Foreground: --color-muted-fg
//             </Typography>
//           </div>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Color components">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Color picker" categoryTitle="Color components">
//             <ColorPicker label="Pick a color" eyeDropper />
//             <ColorPicker />
//           </PlaygroundCard>
//           <PlaygroundCard title="Color field" categoryTitle="Color components">
//             <ColorField label="Pick a color" defaultValue="#0d6efd" onChange={(e) => {}} />
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Toolbar">
//         <div className="flex justify-center">
//           <Toolbar aria-label="Toolbars" className="flex items-center">
//             <ToolbarGroup aria-label="Text Formatting Options" className="flex items-center">
//               <ToggleGroup size="md">
//                 <ToolbarItem defaultSelected aria-label="Bold" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextBIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextBIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//                 <ToolbarItem aria-label="Italic" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextItalicIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextItalicIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//                 <ToolbarItem aria-label="Underline" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextUnderlineIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextUnderlineIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//                 <ToolbarItem aria-label="Strikethrough" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextStrikethroughIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextStrikethroughIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//               </ToggleGroup>
//             </ToolbarGroup>
//             <ToolbarSeparator />
//             <ToolbarGroup aria-label="Alignment" className="flex items-center">
//               <ToggleGroup selectionMode="single">
//                 <ToolbarItem id="0" aria-label="Align Left" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextAlignLeftIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextAlignLeftIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//                 <ToolbarItem id="1" aria-label="Align Center" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextAlignCenterIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextAlignCenterIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//                 <ToolbarItem id="2" aria-label="Align Right" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextAlignRightIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextAlignRightIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//                 <ToolbarItem id="3" aria-label="Align Justify" intent="outline">
//                   {({ isSelected }) => (
//                     <>
//                       {isSelected ? (
//                         <BaseIcon icon={TextAlignJustifyIcon} size="md" weight="bold" />
//                       ) : (
//                         <BaseIcon icon={TextAlignJustifyIcon} size="md" weight="regular" />
//                       )}
//                     </>
//                   )}
//                 </ToolbarItem>
//               </ToggleGroup>
//             </ToolbarGroup>
//             <ToolbarSeparator />
//             <Checkbox>Spell Check</Checkbox>
//             <ToolbarGroup className="ml-auto">
//               <Menu>
//                 <Button aria-label="Other options" variant="ghost" size="md">
//                   Options
//                   <BaseIcon icon={CaretDownIcon} size="md" weight="regular" />
//                 </Button>
//                 <MenuContent showArrow placement="bottom right">
//                   <MenuItem>
//                     <IconUndo />
//                     Undo
//                   </MenuItem>
//                   <MenuItem>
//                     <IconRedo />
//                     Redo
//                   </MenuItem>
//                   <MenuItem>
//                     <IconLink />
//                     Insert Link
//                   </MenuItem>
//                   <MenuItem>
//                     <IconGallery />
//                     Insert Image
//                   </MenuItem>
//                   <MenuItem>
//                     <IconGrid4 />
//                     Insert Grid
//                   </MenuItem>
//                 </MenuContent>
//               </Menu>
//             </ToolbarGroup>
//           </Toolbar>
//         </div>
//       </Wrapper>
//       <Wrapper title="Rich text">
//         <Suspense fallback={<div>Loading...</div>}>
//           <RichTextEditor editorProviderProps={{ extensions: [StarterKit] }} />
//         </Suspense>
//       </Wrapper>
//       <Wrapper title="Date picker">
//         <div className="flex justify-start">
//           <TimeField label="Time to wake up" description="Select the time you want to wake up" />
//         </div>
//       </Wrapper>
//       <Wrapper title="Date picker">
//         <div className="flex justify-start">
//           <DatePicker description="Select your birth date" label="Your birth date" isRequired />
//         </div>
//       </Wrapper>
//       <Wrapper title="Range calendar">
//         <div className="flex justify-start">
//           <RangeCalendar />
//         </div>
//       </Wrapper>
//       <Wrapper title="Date field">
//         <div className="flex">
//           <DateField label="Date of birth" size="md" isRequired />
//         </div>
//       </Wrapper>
//       <Wrapper title="Calendar">
//         <div className="w-full flex">
//           <Calendar aria-label="Event date" />
//         </div>
//       </Wrapper>
//       <Wrapper title="Switch">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size" categoryTitle="Switch">
//             <Switch size="md" />
//           </PlaygroundCard>
//           <PlaygroundCard title="Large size" categoryTitle="Switch">
//             <Switch size="lg" />
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Multi select">
//         <PlaygroundCard title="Multi select" categoryTitle="Multi select">
//           <Select
//             label="Design software"
//             placeholder="Select a software"
//             className="w-[320px]"
//             isRequired
//           >
//             <SelectTrigger
//               prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" weight="regular" />}
//             />
//             <SelectList
//               items={[
//                 { id: 0, name: 'A' },
//                 { id: 1, name: 'B' },
//                 { id: 2, name: 'C' },
//                 { id: 3, name: 'D' },
//               ]}
//             >
//               {(item) => (
//                 <SelectOption id={item.id} textValue={item.name}>
//                   {item.name}
//                 </SelectOption>
//               )}
//             </SelectList>
//           </Select>
//           <Select
//             label="Design software"
//             placeholder="Select a software"
//             className="w-[320px]"
//             isRequired
//             isDisabled
//           >
//             <SelectTrigger />
//             <SelectList
//               items={[
//                 { id: 0, name: 'A' },
//                 { id: 1, name: 'B' },
//                 { id: 2, name: 'C' },
//                 { id: 3, name: 'D' },
//               ]}
//             >
//               {(item) => (
//                 <SelectOption id={item.id} textValue={item.name}>
//                   {item.name}
//                 </SelectOption>
//               )}
//             </SelectList>
//           </Select>
//           <MultipleSelect
//             className="max-w-xs"
//             description="Choose your favorite fruits"
//             label="Fruits"
//             shape="circle"
//             isRequired
//             items={fruits}
//           >
//             {(item) => {
//               return (
//                 <MultipleSelectItem id={item.id} textValue={item.name}>
//                   {item.name}
//                 </MultipleSelectItem>
//               )
//             }}
//           </MultipleSelect>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Tag group">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Tag group" categoryTitle="Tag group">
//             <TagGroup label="Colors" selectionMode="multiple">
//               <TagList
//                 items={[
//                   { id: '1', name: 'Brand', available: false, intent: 'primary' },
//                   { id: '2', name: 'Gray', available: true, intent: 'gray' },
//                   { id: '3', name: 'Correct', available: true, intent: 'correct' },
//                   { id: '4', name: 'Incorrect', available: false, intent: 'incorrect' },
//                   { id: '5', name: 'Accent', available: false, intent: 'accent' },
//                   { id: '6', name: 'Info', available: false, intent: 'info' },
//                 ]}
//               >
//                 {(item) => <Tag intent={item.intent as any}>{item.name}</Tag>}
//               </TagList>
//             </TagGroup>
//           </PlaygroundCard>
//           <PlaygroundCard title="Tag group with remove" categoryTitle="Tag group">
//             <TagGroup label="Android Brands (sm)" selectionMode="multiple" onRemove={() => {}}>
//               <TagList
//                 items={[
//                   { id: '1', name: 'Samsung', available: false },
//                   { id: '2', name: 'OnePlus', available: true },
//                   { id: '3', name: 'Google', available: true },
//                   { id: '4', name: 'Xiaomi', available: false },
//                 ]}
//               >
//                 {(item) => <Tag size="sm">{item.name}</Tag>}
//               </TagList>
//             </TagGroup>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Badge">
//         <PlaygroundCard title="Small size (sm)" categoryTitle="Badge">
//           <div className="flex flex-wrap gap-2">
//             {['gray', 'brand', 'blue', 'red', 'yellow', 'green', 'purple', 'cyan'].map(
//               (intent, index) => (
//                 <Badge key={index} intent={intent as any} shape="circle" size="sm">
//                   {intent}
//                 </Badge>
//               )
//             )}
//           </div>
//         </PlaygroundCard>
//         <PlaygroundCard title="Medium size (md)" categoryTitle="Badge">
//           <div className="flex flex-wrap gap-2">
//             {['gray', 'brand', 'blue', 'red', 'yellow', 'green', 'purple', 'cyan'].map(
//               (intent, index) => (
//                 <Badge key={index} intent={intent as any} shape="circle">
//                   {intent}
//                 </Badge>
//               )
//             )}
//           </div>
//         </PlaygroundCard>
//         <PlaygroundCard title="Large size (lg)" categoryTitle="Badge">
//           <div className="flex flex-wrap gap-2">
//             {['gray', 'brand', 'blue', 'red', 'yellow', 'green', 'purple', 'cyan'].map(
//               (intent, index) => (
//                 <Badge key={index} intent={intent as any} shape="circle" size="lg">
//                   {intent}
//                 </Badge>
//               )
//             )}
//           </div>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Modal">
//         <PlaygroundCard title="Dialog" categoryTitle="Modal">
//           <Modal>
//             <ModalTrigger size="md" variant="outline">
//               Confirm
//             </ModalTrigger>
//             <ModalContent
//               isBlurred
//               role="alertdialog"
//               classNames={{ content: 'w-fit min-w-[16rem]' }}
//             >
//               <ModalHeader className="[&[data-slot=dialog-header]:has(+[data-slot=dialog-footer])]:pb-12">
//                 <ModalTitle level={3}>Delete file</ModalTitle>
//                 <ModalDescription>
//                   This will permanently delete the selected file. Continue?
//                 </ModalDescription>
//               </ModalHeader>
//               <ModalFooter className="flex justify-between">
//                 <ModalClose variant="outline" size="sm" className="w-1/2">
//                   Cancel
//                 </ModalClose>
//                 <ModalClose variant="destruction" size="sm" className="w-1/2">
//                   Delete
//                   <BaseIcon icon={TrashIcon} size="sm" />
//                 </ModalClose>
//               </ModalFooter>
//             </ModalContent>
//           </Modal>
//         </PlaygroundCard>
//         <PlaygroundCard title="Modal confirm" categoryTitle="Modal">
//           <Modal>
//             <ModalTrigger size="md" variant="outline">
//               Turn on 2FA
//             </ModalTrigger>
//             <ModalContent>
//               <ModalHeader>
//                 <ModalTitle>Nice! Let&apos;s beef up your account.</ModalTitle>
//                 <ModalDescription>
//                   2FA beefs up your account&apos;s defense. Pop in your password to keep going.
//                 </ModalDescription>
//               </ModalHeader>
//               <form>
//                 <ModalBody>
//                   <TextField
//                     isRequired
//                     autoFocus
//                     label="Password"
//                     type="password"
//                     placeholder="Enter your password"
//                   />
//                 </ModalBody>
//                 <ModalFooter>
//                   <ModalClose variant="naked" size="sm">
//                     Cancel
//                   </ModalClose>
//                   <Button size="sm" variant="primary" type="submit">
//                     Turn on 2FA
//                   </Button>
//                 </ModalFooter>
//               </form>
//             </ModalContent>
//           </Modal>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Popover">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Popover (Form)" categoryTitle="Popover">
//             <Popover>
//               <Button variant="primary" size="md">
//                 Login
//               </Button>
//               <PopoverContent className="sm:min-w-96">
//                 <PopoverHeader>
//                   <PopoverTitle>Login</PopoverTitle>
//                   <PopoverDescription>Enter your credentials to sign in.</PopoverDescription>
//                 </PopoverHeader>
//                 <form onSubmit={() => {}} className="w-[400px]">
//                   <PopoverBody>
//                     <div className="space-y-4">
//                       <TextField
//                         autoFocus
//                         isRequired
//                         size="sm"
//                         type="email"
//                         label="Email"
//                         placeholder="Enter your email"
//                       />
//                       <TextField
//                         isRequired
//                         isRevealable
//                         size="sm"
//                         label="Password"
//                         type="password"
//                         placeholder="Enter your password"
//                       />
//                       <div className="my-4 flex items-center justify-between">
//                         <Checkbox name="remember-me">Remember me</Checkbox>
//                         <Link className="text-sm" href="#">
//                           Forgot password?
//                         </Link>
//                       </div>
//                       <div>
//                         <CheckboxGroup
//                           name="settings"
//                           label="Settings"
//                           description="Select the permissions you want to grant to the user."
//                         >
//                           <Checkbox value="read">Read</Checkbox>
//                           <Checkbox value="write">Write</Checkbox>
//                           <Checkbox value="delete">Delete</Checkbox>
//                           <Checkbox value="admin">Admin</Checkbox>
//                         </CheckboxGroup>
//                       </div>
//                     </div>
//                   </PopoverBody>
//                   <PopoverFooter>
//                     <PopoverClose variant="outline" size="sm">
//                       Cancel
//                     </PopoverClose>
//                     <Button type="submit" variant="tertiary" size="sm">
//                       Login
//                     </Button>
//                   </PopoverFooter>
//                 </form>
//               </PopoverContent>
//             </Popover>
//           </PlaygroundCard>
//           <PlaygroundCard title="Popover (normal-1)" categoryTitle="Popover">
//             <Popover>
//               <Button size="sm" variant="outline">
//                 Forgot Password
//               </Button>
//               <PopoverContent className="sm:max-w-72">
//                 <PopoverHeader>
//                   <PopoverTitle>Email</PopoverTitle>
//                   <PopoverDescription>We&apos;ll send you an email to log in.</PopoverDescription>
//                 </PopoverHeader>
//               </PopoverContent>
//             </Popover>
//           </PlaygroundCard>
//           <PlaygroundCard title="Popover (normal-2)" categoryTitle="Popover">
//             <Popover>
//               <Button size="sm" variant="outline">
//                 Open popover
//               </Button>
//               <PopoverContent className="sm:w-[16rem]">
//                 <PopoverHeader>
//                   <PopoverTitle level={4}>Popover Title</PopoverTitle>
//                   <PopoverDescription>Lorem ipsum dolor sit amet</PopoverDescription>
//                 </PopoverHeader>
//                 <PopoverBody>
//                   Popover Body | Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur
//                   adipisicing elit. Quos, temporibus.
//                 </PopoverBody>
//                 <PopoverFooter>
//                   <PopoverClose size="sm" variant="outline">
//                     Close
//                   </PopoverClose>
//                   <PopoverClose size="sm" variant="secondary">
//                     Confirm
//                   </PopoverClose>
//                 </PopoverFooter>
//               </PopoverContent>
//             </Popover>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Listbox">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Listbox (normal)" categoryTitle="Listbox">
//             <ListBox items={MOCK_OPTIONS} selectionMode="single" aria-label="Bands">
//               {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
//             </ListBox>
//           </PlaygroundCard>
//           <PlaygroundCard title="Listbox (multiple selection)" categoryTitle="Listbox">
//             <ListBox items={MOCK_OPTIONS} selectionMode="multiple" aria-label="Bands">
//               {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
//             </ListBox>
//           </PlaygroundCard>
//           <PlaygroundCard title="Listbox (Description)" categoryTitle="Listbox">
//             <ListBox selectedKeys={[]} items={MOCK_OPTIONS} aria-label="Bands">
//               {(item) => (
//                 <ListBoxItem id={item.id} textValue={item.name}>
//                   <ListBoxItemDetails label={item.name} description={item.description} />
//                 </ListBoxItem>
//               )}
//             </ListBox>
//           </PlaygroundCard>
//           <PlaygroundCard title="Listbox (Section)" categoryTitle="Listbox">
//             <ListBox items={countries} aria-label="Bands" selectionMode="multiple">
//               {(country) => (
//                 <ListBoxSection items={country.cities} title={country.name} id={country.id}>
//                   {(country: any) => <ListBoxItem id={country.id}>{country.name}</ListBoxItem>}
//                 </ListBoxSection>
//               )}
//             </ListBox>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Dropdown">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Dropdown (normal)" categoryTitle="Dropdown">
//             <Select>
//               <SelectTrigger />
//               <SelectList items={MOCK_OPTIONS}>
//                 {(item) => (
//                   <SelectOption id={item.id} textValue={item.name}>
//                     {item.name}
//                   </SelectOption>
//                 )}
//               </SelectList>
//             </Select>
//           </PlaygroundCard>
//           <PlaygroundCard title="Dropdown (group section)" categoryTitle="Dropdown">
//             <Select defaultSelectedKey={1} aria-label="Countries" placeholder="Select a country">
//               <SelectTrigger />
//               <SelectList items={countries}>
//                 {(country) => (
//                   <SelectSection title={country.name} items={country.cities}>
//                     {(city: any) => <SelectOption textValue={city.name}>{city.name}</SelectOption>}
//                   </SelectSection>
//                 )}
//               </SelectList>
//             </Select>
//           </PlaygroundCard>
//           <PlaygroundCard title="Dropdown (icon)" categoryTitle="Dropdown">
//             <Select aria-label="Devices" defaultSelectedKey="desktop" placeholder="Select a device">
//               <SelectTrigger />
//               <SelectList>
//                 <SelectOption isDisabled id="discord" textValue="Discord">
//                   <BaseIcon icon={DiscordLogoIcon} size="md" />
//                   <SelectLabel>Discord</SelectLabel>
//                 </SelectOption>
//                 <SelectSeparator />
//                 <SelectOption id="github" textValue="GitHub">
//                   <BaseIcon icon={GithubLogoIcon} size="md" />
//                   <SelectLabel>GitHub</SelectLabel>
//                 </SelectOption>
//                 <SelectOption id="gitlab" textValue="GitLab">
//                   GitLab
//                 </SelectOption>
//               </SelectList>
//             </Select>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Typography">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Label" categoryTitle="Typography">
//             <ul>
//               <li>
//                 <Typography type="label" weight="normal">
//                   Label/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="label" weight="medium">
//                   Label/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="label" weight="semibold">
//                   Label/semibold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//           <PlaygroundCard title="Caption" categoryTitle="Typography">
//             <ul className="">
//               <li>
//                 <Typography type="caption" weight="normal">
//                   Caption/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="caption" weight="medium">
//                   Caption/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="caption" weight="semibold">
//                   Caption/semibold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//           <PlaygroundCard title="Body" categoryTitle="Typography">
//             <ul className="">
//               <li>
//                 <Typography type="body" weight="normal">
//                   Body/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="body" weight="medium">
//                   Body/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="body" weight="semibold">
//                   Body/semibold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//           <PlaygroundCard title="h4" categoryTitle="Typography">
//             <ul className="">
//               <li>
//                 <Typography type="h4" weight="normal">
//                   h4/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h4" weight="medium">
//                   h4/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h4" weight="semibold">
//                   h4/semibold
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h4" weight="bold">
//                   h4/bold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//           <PlaygroundCard title="h3" categoryTitle="Typography">
//             <ul className="">
//               <li>
//                 <Typography type="h3" weight="normal">
//                   h3/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h3" weight="medium">
//                   h3/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h3" weight="semibold">
//                   h3/semibold
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h3" weight="bold">
//                   h3/bold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//           <PlaygroundCard title="h2" categoryTitle="Typography">
//             <ul className="">
//               <li>
//                 <Typography type="h2" weight="normal">
//                   h2/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h2" weight="medium">
//                   h2/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h2" weight="semibold">
//                   h2/semibold
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h2" weight="bold">
//                   h2/bold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//           <PlaygroundCard title="h1" categoryTitle="Typography">
//             <ul className="">
//               <li>
//                 <Typography type="h1" weight="normal">
//                   h1/regular
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h1" weight="medium">
//                   h1/medium
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h1" weight="semibold">
//                   h1/semibold
//                 </Typography>
//               </li>
//               <li>
//                 <Typography type="h1" weight="bold">
//                   h1/bold
//                 </Typography>
//               </li>
//             </ul>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Textfield">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size (md)" categoryTitle="Button">
//             <div className="flex flex-col space-y-4">
//               <Switch onChange={() => {}} />
//               <TextField
//                 isRequired={false}
//                 label="Package owner"
//                 description="This is a helper text"
//                 size="md"
//                 isDisabled
//                 placeholder="Data"
//               />
//               <TextField
//                 isRequired
//                 type="text"
//                 label="Something label and small textfield"
//                 description="This is a helper text"
//                 prefix={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 suffix={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 size="xs"
//               />
//               <TextField
//                 isRequired
//                 type="password"
//                 label="Some large textfield"
//                 isPending
//                 description="This is a helper text"
//                 size="lg"
//               />
//               <TextField
//                 isRequired
//                 type="password"
//                 label="Package name"
//                 isRevealable
//                 description="This is a helper text"
//                 size="md"
//               />
//               <TextField
//                 isRequired
//                 label="Package name"
//                 type="text"
//                 description="This is a helper text"
//                 size="md"
//                 prefix={<BaseIcon icon={PlusCircleIcon} size="md" />}
//               />
//               <TextField
//                 isRequired
//                 label="Package name"
//                 type="text"
//                 description="This is a helper text"
//                 size="md"
//                 suffix={<BaseIcon icon={PlusCircleIcon} size="md" />}
//               />
//               <TextField type="text" size="md" />
//               <TextField
//                 type="text"
//                 size="sm"
//                 prefix={
//                   <div className="bg-secondary rounded-sm p-2">
//                     <Typography type="caption" className="text-secondary-fg" weight="normal">
//                       Prefix
//                     </Typography>
//                   </div>
//                 }
//                 suffix={
//                   <div className="bg-secondary rounded-sm p-2">
//                     <Typography type="caption" className="text-secondary-fg" weight="normal">
//                       Suffix
//                     </Typography>
//                   </div>
//                 }
//               />
//               <TextField
//                 type="text"
//                 description="lorem"
//                 size="xs"
//                 prefix={'MR.'}
//                 suffix={'Right?'}
//                 isDisabled
//               />
//               <TextField type="text" description="copy" size="md" isShowCopyButton isShowHttp />
//             </div>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Textarea">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size (md)" categoryTitle="Textarea">
//             <Textarea
//               label="Package name"
//               description="This is a helper text"
//               placeholder="Data"
//               className="w-full"
//               isRequired
//             />
//             <Textarea
//               label="Package name"
//               description="This is a helper text"
//               placeholder="Data"
//               className="w-full"
//               isRequired
//               isDisabled
//             />
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Button">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size (md)" categoryTitle="Button">
//             <div className="flex w-full flex-col items-start gap-y-3">
//               <Button
//                 variant="primary"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Primary
//               </Button>
//               <Button
//                 variant="secondary"
//                 isDisabled
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Secondary
//               </Button>
//               <Button
//                 variant="tertiary"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Tertiary
//               </Button>
//               <Button
//                 variant="naked"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Naked
//               </Button>
//               <Button
//                 variant="outline"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Outline
//               </Button>
//               <Button
//                 variant="ghost"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Ghost
//               </Button>
//               <Button
//                 variant="destruction"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Destruction
//               </Button>
//             </div>
//           </PlaygroundCard>
//           <PlaygroundCard title="Medium size (md) (disabled)" categoryTitle="Button">
//             <div className="flex w-full flex-col items-start gap-y-3">
//               <Button
//                 isDisabled
//                 variant="primary"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Primary
//               </Button>
//               <Button
//                 isDisabled
//                 variant="secondary"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Secondary
//               </Button>
//               <Button
//                 isDisabled
//                 variant="tertiary"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Tertiary
//               </Button>
//               <Button
//                 isDisabled
//                 variant="naked"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Naked
//               </Button>
//               <Button
//                 isDisabled
//                 variant="outline"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Outline
//               </Button>
//               <Button
//                 isDisabled
//                 variant="ghost"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Ghost
//               </Button>
//               <Button
//                 isDisabled
//                 variant="destruction"
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="md" />}
//                 size="md"
//               >
//                 Destruction
//               </Button>
//             </div>
//           </PlaygroundCard>
//           <PlaygroundCard title="Small size (sm)" categoryTitle="Button">
//             <div className="flex flex-col items-start gap-y-3">
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="primary"
//                 size="sm"
//               >
//                 Primary
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="secondary"
//                 size="sm"
//               >
//                 Secondary
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="tertiary"
//                 size="sm"
//               >
//                 Tertiary
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="naked"
//                 size="sm"
//               >
//                 Naked
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="outline"
//                 size="sm"
//               >
//                 Outline
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="ghost"
//                 size="sm"
//               >
//                 Ghost
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="destruction"
//                 size="sm"
//               >
//                 Destruction
//               </Button>
//             </div>
//           </PlaygroundCard>
//           <PlaygroundCard title="Extra small size (xs)" categoryTitle="Button">
//             <div className="flex flex-col items-start gap-y-3">
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="primary"
//                 size="xs"
//               >
//                 Primary
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="secondary"
//                 size="xs"
//               >
//                 Secondary
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="tertiary"
//                 size="xs"
//               >
//                 Tertiary
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="naked"
//                 size="xs"
//               >
//                 Naked
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="outline"
//                 size="xs"
//               >
//                 Outline
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="ghost"
//                 size="xs"
//               >
//                 Ghost
//               </Button>
//               <Button
//                 leadingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 trailingIcon={<BaseIcon icon={PlusCircleIcon} size="sm" />}
//                 variant="destruction"
//                 size="xs"
//               >
//                 Destruction
//               </Button>
//             </div>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Icon button">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size (md)" categoryTitle="Button">
//             <div className="flex w-full flex-col items-start gap-y-3">
//               <Button variant="primary" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//               <Button variant="secondary" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//               <Button variant="tertiary" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//               <Button variant="naked" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//               <Button variant="outline" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//               <Button variant="ghost" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//               <Button variant="destruction" size="md">
//                 <BaseIcon icon={PlusCircleIcon} size="md" />
//               </Button>
//             </div>
//           </PlaygroundCard>
//           <PlaygroundCard title="Medium size (sm)" categoryTitle="Button">
//             <div className="flex w-full flex-col items-start gap-y-3">
//               <Button variant="primary" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="secondary" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="tertiary" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="naked" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="outline" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="ghost" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="destruction" size="sm">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//             </div>
//           </PlaygroundCard>
//           <PlaygroundCard title="Extra small size (xs)" categoryTitle="Button">
//             <div className="flex w-full flex-col items-start gap-y-3">
//               <Button variant="primary" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="secondary" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="tertiary" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="naked" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="outline" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="ghost" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//               <Button variant="destruction" size="xs">
//                 <BaseIcon icon={PlusCircleIcon} size="sm" />
//               </Button>
//             </div>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>
//       <Wrapper title="Base icon">
//         <PlaygroundCard title="Medium size (md)" categoryTitle="Base icon">
//           <div className="flex items-center gap-x-4">
//             <div className="flex items-center">
//               <BaseIcon icon={PlusCircleIcon} size="xl" />
//               <Typography type="label" weight="semibold">
//                 xl
//               </Typography>
//             </div>
//             <div className="flex items-center">
//               <BaseIcon icon={PlusCircleIcon} size="lg" />
//               <Typography type="label" weight="semibold">
//                 lg
//               </Typography>
//             </div>
//             <div className="flex items-center">
//               <BaseIcon icon={PlusCircleIcon} size="md" />
//               <Typography type="label" weight="semibold">
//                 md
//               </Typography>
//             </div>
//             <div className="flex items-center">
//               <BaseIcon icon={PlusCircleIcon} size="sm" />
//               <Typography type="label" weight="semibold">
//                 sm
//               </Typography>
//             </div>
//             <div className="flex items-center">
//               <BaseIcon icon={PlusCircleIcon} size="xs" />
//               <Typography type="label" weight="semibold">
//                 xs
//               </Typography>
//             </div>
//           </div>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Button group">
//         <PlaygroundCard title="Medium size (md)" categoryTitle="Button group">
//           <div className="flex items-center gap-x-4">
//             <ButtonGroup>
//               <ButtonGroupItem id="1d">1d</ButtonGroupItem>
//               <ButtonGroupItem id="1w">1w</ButtonGroupItem>
//               <ButtonGroupItem id="1m">1m</ButtonGroupItem>
//               <ButtonGroupItem id="1y">1y</ButtonGroupItem>
//             </ButtonGroup>
//           </div>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Breadcrumbs">
//         <PlaygroundCard title="4 items" categoryTitle="Breadcrumbs">
//           <Breadcrumbs>
//             <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
//             <BreadcrumbsItem href="/">Page1</BreadcrumbsItem>
//             <BreadcrumbsItem href="/">Page2</BreadcrumbsItem>
//             <BreadcrumbsItem href="/">Page3</BreadcrumbsItem>
//           </Breadcrumbs>
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Pagination">
//         <PlaygroundCard title="Default" categoryTitle="Pagination">
//           <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
//         </PlaygroundCard>
//         <PlaygroundCard title="With dropdown" categoryTitle="Pagination">
//           <PageSizeSelect pageSize={10} onPageSizeChange={() => {}} />
//         </PlaygroundCard>
//       </Wrapper>
//       <Wrapper title="Radio group">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size (md)" categoryTitle="Radio group">
//             <RadioGroup aria-label="Radio">
//               <Radio value="x">X</Radio>
//               <Radio value="y">Y</Radio>
//               <Radio value="z" isDisabled>
//                 Z
//               </Radio>
//             </RadioGroup>
//           </PlaygroundCard>
//           <PlaygroundCard title="Small size (sm)" categoryTitle="Radio group">
//             <RadioGroup aria-label="Radio">
//               <Radio value="x" size="sm">
//                 X
//               </Radio>
//               <Radio value="y" size="sm">
//                 Y
//               </Radio>
//               <Radio value="z" isDisabled size="sm">
//                 Z
//               </Radio>
//             </RadioGroup>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>

//       <Wrapper title="Checkbox">
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
//           <PlaygroundCard title="Medium size (md)" categoryTitle="Checkbox">
//             <CheckboxGroup>
//               <Checkbox value="x">X</Checkbox>
//               <Checkbox
//                 value="y"
//                 label="Remember me"
//                 description="Save my login details for next time"
//               ></Checkbox>
//               <Checkbox isDisabled value="z">
//                 Z
//               </Checkbox>
//             </CheckboxGroup>
//           </PlaygroundCard>
//           <PlaygroundCard title="Large size (lg)" categoryTitle="Checkbox">
//             <CheckboxGroup>
//               <Checkbox
//                 size="lg"
//                 value="y"
//                 label="Remember me"
//                 description="Save my login details for next time"
//               />
//               <Checkbox isDisabled value="z" label="Hello world" size="lg" />
//             </CheckboxGroup>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>

//       <Wrapper title="Reorder group">
//         <ReorderGroup title="Reorder Item" onReorder={handleReorder}>
//           {btnData.map((b) => (
//             // key use for reorder group
//             <div key={b.id} className="p-4 bg-bluegray-600 text-bluegray-50">
//               {b.text}
//             </div>
//           ))}
//         </ReorderGroup>
//       </Wrapper>

//       <Wrapper title="Progress bar">
//         <div className="grid grid-cols-3 gap-4">
//           <PlaygroundCard title="Default" categoryTitle="Progress bar">
//             <ProgressBar value={0} className="w-full" />
//             <ProgressBar value={25} className="w-full" />
//             <ProgressBar value={50} className="w-full" />
//             <ProgressBar value={75} className="w-full" />
//             <ProgressBar value={100} className="w-full" />
//           </PlaygroundCard>

//           <PlaygroundCard title="isShowPercent" categoryTitle="Progress bar">
//             <ProgressBar value={0} className="w-full" />
//             <ProgressBar value={25} className="w-full" isShowPercent />
//             <ProgressBar value={50} className="w-full" isShowPercent />
//             <ProgressBar value={75} className="w-full" isShowPercent />
//             <ProgressBar value={100} className="w-full" isShowPercent />
//           </PlaygroundCard>
//           <PlaygroundCard title="isShowPercentPopup" categoryTitle="Progress bar">
//             <ProgressBar value={0} className="w-full" isShowPercentPopup />
//             <ProgressBar value={25} className="w-full" isShowPercentPopup />
//             <ProgressBar value={50} className="w-full" isShowPercentPopup />
//             <ProgressBar value={75} className="w-full" isShowPercentPopup />
//             <ProgressBar value={100} className="w-full" isShowPercentPopup />
//           </PlaygroundCard>
//         </div>
//       </Wrapper>

//       <Wrapper title="Avatar">
//         <PlaygroundCard title="Normal" categoryTitle="Avatar">
//           <Avatar src="https://github.com/shadcn.png" size="xl" isShowIndicator />
//           <Avatar src="https://github.com/shadcn.png" size="lg" isShowIndicator />
//           <Avatar size="md" isShowIndicator />
//           <Avatar src="https://github.com/shadcn.png" size="sm" isShowIndicator label="test" />
//           <Avatar
//             src="https://github.com/shadcn.png"
//             size="xs"
//             isShowIndicator
//             label="test"
//             subLabel="test"
//           />
//         </PlaygroundCard>
//       </Wrapper>

//       <Wrapper title="Tabs">
//         <div className="grid grid-cols-3 gap-4">
//           <PlaygroundCard title="Default" categoryTitle="Tabs">
//             <Tabs size="lg">
//               <TabList>
//                 <Tab>Label 1</Tab>
//                 <Tab>Label 2</Tab>
//                 <Tab>Label 3</Tab>
//               </TabList>
//             </Tabs>
//           </PlaygroundCard>
//           <PlaygroundCard title="With badgeNumber" categoryTitle="Tabs">
//             <Tabs size="md">
//               <TabList>
//                 <Tab badgeNumber={1}>Label 1</Tab>
//                 <Tab badgeNumber={2}>Label 2</Tab>
//                 <Tab badgeNumber={3}>Label 3</Tab>
//               </TabList>
//             </Tabs>
//           </PlaygroundCard>
//         </div>
//       </Wrapper>

//       <Wrapper title="Card">
//         <PlaygroundCard title="Default" categoryTitle="Card">
//           <Card
//             title="Card Title"
//             itemNumber={10}
//             description="Manage your product catalog including inventory, pricing, and categories."
//             buttonTitle="Card Action"
//           />
//         </PlaygroundCard>
//       </Wrapper>

//       <Wrapper title="Annotation">
//         <Annotation>Annotation</Annotation>
//         <Annotation className="bg-surface-incorrect text-text-incorrect">Annotation</Annotation>
//       </Wrapper>

//       <Wrapper title="Tools Tip group">
//         <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 **:[button]:w-full">
//           <Tooltip>
//             <Button className="mx-auto" size="sm" variant="outline">
//               Bottom
//             </Button>
//             <TooltipContent placement="bottom">
//               Tooltip shown at <strong>bottom</strong>.
//             </TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <Button className="mx-auto" size="sm" variant="outline">
//               Top
//             </Button>
//             <TooltipContent placement="top">
//               Tooltip shown at <strong>top</strong>.
//             </TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <Button className="mx-auto" size="sm" variant="outline">
//               Left
//             </Button>
//             <TooltipContent placement="left">
//               Tooltip shown at <strong>left</strong>.
//             </TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <Button className="mx-auto" size="sm" variant="outline">
//               Right
//             </Button>
//             <TooltipContent placement="right">
//               Tooltip shown at <strong>right</strong>.
//             </TooltipContent>
//           </Tooltip>
//         </div>
//       </Wrapper>

//       <Wrapper title="Table">
//         <div className="flex flex-col gap-4">
//           <Table aria-label="Bands">
//             <TableHeader>
//               <TableRow>
//                 <TableHead>#</TableHead>
//                 <TableHead>Name</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell>1</TableCell>
//                 <TableCell>Nirvana</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell>2</TableCell>
//                 <TableCell>The Beatles</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>

//           <Table aria-label="Bands">
//             <TableHeader>
//               <TableRow>
//                 <TableHead>#</TableHead>
//                 <TableHead>Name</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell>1</TableCell>
//                 <TableCell>Nirvana</TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell>2</TableCell>
//                 <TableCell>The Beatles</TableCell>
//               </TableRow>
//               {/* Pagination */}
//               <TableRow>
//                 <TableCell colSpan={2}>
//                   <div className="flex justify-between items-center w-full">
//                     <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
//                     <PageSizeSelect pageSize={10} onPageSizeChange={() => {}} />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>

//           <Table aria-label="not-found">
//             <TableHeader>
//               <TableRow>
//                 <TableHead>#</TableHead>
//                 <TableHead>Name</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell colSpan={2} className="text-center h-64">
//                   <p>Not founds</p>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </div>
//       </Wrapper>

//       <Wrapper title="Form">
//         <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
//           <TextField label="Name" placeholder="Enter your name" isRequired />
//           <Textarea
//             label="Description"
//             placeholder="Enter your description"
//             errorMessage="Description is required"
//           />
//           <Button type="submit" variant="primary" size="sm">
//             Submit
//           </Button>
//         </form>
//       </Wrapper>
//     </div>
//   )
// }
