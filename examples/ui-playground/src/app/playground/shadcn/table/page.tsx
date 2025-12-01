'use client'
import { useState } from 'react'

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  PageIndex,
  PageSizeSelect,
  Pagination,
  PaginationBarContainer,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  TanstackTable,
  TanstackTableContainer,
} from '@genseki/ui'

interface User {
  id: number
  fname: string
  lname: string
  food: string
  occupation: string
  city: string
  favoriteColor: string
  hobby: string
  department: string
  email: string
  phone: string
  address: string
  notes: string
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('fname', {
    header: 'First Name',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('lname', {
    header: 'Last Name',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('food', {
    header: 'Favorite Food',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('occupation', {
    header: 'Occupation',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('city', {
    header: 'City',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('favoriteColor', {
    header: 'Favorite Color',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('hobby', {
    header: 'Hobby',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (props) => <p className="truncate max-w-[200px]">{props.getValue()}</p>,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    cell: (props) => <p className="truncate max-w-[240px]">{props.getValue()}</p>,
  }),
  columnHelper.accessor('notes', {
    header: 'Notes',
    cell: (props) => <p className="truncate max-w-[280px]">{props.getValue()}</p>,
  }),
]

const users: User[] = [
  {
    id: 1,
    fname: 'Supakorn',
    lname: 'Netsuwan',
    food: 'Hamburger',
    occupation: 'Product Designer',
    city: 'Bangkok',
    favoriteColor: 'Teal',
    hobby: 'Photography',
    department: 'Experience Lab',
    email: 'supakorn.netsuwan@genseki.example',
    phone: '+66 81 234 5678',
    address: '88 Sukhumvit Rd, Khlong Toei, Bangkok 10110',
    notes: 'Leading avatar design revamp; requires weekly sync for approvals.',
  },
  {
    id: 2,
    fname: 'Jane',
    lname: 'Doe',
    food: 'Pizza',
    occupation: 'Frontend Dev',
    city: 'Chicago',
    favoriteColor: 'Lavender',
    hobby: 'Cycling',
    department: 'Web Platform',
    email: 'jane.doe@genseki.example',
    phone: '+1 (312) 555-1010',
    address: '2200 W North Ave, Chicago, IL 60622',
    notes: 'Owns table virtualization workstream; pinning regression tester.',
  },
  {
    id: 3,
    fname: 'John',
    lname: 'Smith',
    food: 'Sushi',
    occupation: 'Data Analyst',
    city: 'Seattle',
    favoriteColor: 'Navy',
    hobby: 'Chess',
    department: 'Insights',
    email: 'john.smith@genseki.example',
    phone: '+1 (206) 555-0440',
    address: '5024 Ballard Ave NW, Seattle, WA 98107',
    notes: 'Demands CSV parity; prefers keyboard navigation for grids.',
  },
  {
    id: 4,
    fname: 'Emily',
    lname: 'Johnson',
    food: 'Tacos',
    occupation: 'UX Researcher',
    city: 'Austin',
    favoriteColor: 'Coral',
    hobby: 'Hiking',
    department: 'Research Guild',
    email: 'emily.johnson@genseki.example',
    phone: '+1 (512) 555-9981',
    address: '1401 E 7th St, Austin, TX 78702',
    notes: 'Runs monthly diary studies; needs sticky headers for sessions.',
  },
  {
    id: 5,
    fname: 'Michael',
    lname: 'Brown',
    food: 'Pasta',
    occupation: 'Marketing Lead',
    city: 'Toronto',
    favoriteColor: 'Olive',
    hobby: 'Cooking',
    department: 'Growth Studio',
    email: 'michael.brown@genseki.example',
    phone: '+1 (416) 555-3388',
    address: '160 Front St W, Toronto, ON M5J 1G1',
    notes: 'Preps investor decks; exports snapshots for print layouts.',
  },
  {
    id: 6,
    fname: 'Alice',
    lname: 'Williams',
    food: 'Steak',
    occupation: 'QA Engineer',
    city: 'Denver',
    favoriteColor: 'Maroon',
    hobby: 'Rock Climbing',
    department: 'Quality Core',
    email: 'alice.williams@genseki.example',
    phone: '+1 (303) 555-6641',
    address: '1550 Market St, Denver, CO 80202',
    notes: 'Stress-tests scroll sync; files bugs with video repros.',
  },
  {
    id: 7,
    fname: 'Robert',
    lname: 'Taylor',
    food: 'Salad',
    occupation: 'Sales Manager',
    city: 'New York',
    favoriteColor: 'Gray',
    hobby: 'Running',
    department: 'Revenue Ops',
    email: 'robert.taylor@genseki.example',
    phone: '+1 (917) 555-7171',
    address: '230 Hudson St, New York, NY 10013',
    notes: 'Requires CRM export parity; pins region and quota columns.',
  },
  {
    id: 8,
    fname: 'Linda',
    lname: 'Anderson',
    food: 'Ice Cream',
    occupation: 'Content Writer',
    city: 'Portland',
    favoriteColor: 'Mint',
    hobby: 'Gardening',
    department: 'Story Studio',
    email: 'linda.anderson@genseki.example',
    phone: '+1 (971) 555-2226',
    address: '401 NE 19th Ave, Portland, OR 97232',
    notes: 'Needs drag-to-reorder columns for narrative templates.',
  },
  {
    id: 9,
    fname: 'David',
    lname: 'Thomas',
    food: 'Chicken',
    occupation: 'SysAdmin',
    city: 'San Jose',
    favoriteColor: 'Black',
    hobby: 'Retro Gaming',
    department: 'Infra',
    email: 'david.thomas@genseki.example',
    phone: '+1 (408) 555-7620',
    address: '70 S Market St, San Jose, CA 95113',
    notes: 'Pushes for dark mode grid lines; manages fleet dashboards.',
  },
  {
    id: 10,
    fname: 'Barbara',
    lname: 'Jackson',
    food: 'Sandwich',
    occupation: 'HR Partner',
    city: 'Boston',
    favoriteColor: 'Magenta',
    hobby: 'Yoga',
    department: 'People Ops',
    email: 'barbara.jackson@genseki.example',
    phone: '+1 (617) 555-3141',
    address: '745 Atlantic Ave, Boston, MA 02111',
    notes: 'Relies on sticky action column for quick cases.',
  },
  {
    id: 11,
    fname: 'William',
    lname: 'White',
    food: 'Burger',
    occupation: 'CFO',
    city: 'London',
    favoriteColor: 'Charcoal',
    hobby: 'Sailing',
    department: 'Finance',
    email: 'william.white@genseki.example',
    phone: '+44 20 5555 0400',
    address: '1 Angel Ln, London EC4R 3AB',
    notes: 'Analyzes multi-currency KPI tables exceeding 20 columns.',
  },
  {
    id: 12,
    fname: 'Susan',
    lname: 'Harris',
    food: 'Soup',
    occupation: 'Operations Lead',
    city: 'Atlanta',
    favoriteColor: 'Orange',
    hobby: 'Knitting',
    department: 'Operations',
    email: 'susan.harris@genseki.example',
    phone: '+1 (404) 555-8804',
    address: '725 Ponce De Leon Ave NE, Atlanta, GA 30306',
    notes: 'Tests freeze panes on touch devices; notes on field teams.',
  },
  {
    id: 13,
    fname: 'James',
    lname: 'Martin',
    food: 'Ramen',
    occupation: 'Backend Dev',
    city: 'Tokyo',
    favoriteColor: 'Indigo',
    hobby: 'Travel',
    department: 'Core Services',
    email: 'james.martin@genseki.example',
    phone: '+81 3-5550-1200',
    address: '1-1 Marunouchi, Chiyoda City, Tokyo 100-0005',
    notes: 'Benchmarks 2k row tables; demands minimal GC pressure.',
  },
  {
    id: 14,
    fname: 'Patricia',
    lname: 'Thompson',
    food: 'Falafel',
    occupation: 'Legal Counsel',
    city: 'Dublin',
    favoriteColor: 'Emerald',
    hobby: 'Reading',
    department: 'Legal',
    email: 'patricia.thompson@genseki.example',
    phone: '+353 1 555 7020',
    address: '2 Grand Canal Square, Dublin 2',
    notes: 'Needs audit log columns pinned right for compliance.',
  },
  {
    id: 15,
    fname: 'Christopher',
    lname: 'Garcia',
    food: 'Curry',
    occupation: 'Solutions Arch',
    city: 'Madrid',
    favoriteColor: 'Yellow',
    hobby: 'Soccer',
    department: 'Field Engineering',
    email: 'christopher.garcia@genseki.example',
    phone: '+34 91 555 9090',
    address: 'Paseo de la Castellana, 81, 28046 Madrid',
    notes: 'Evaluates horizontal snap points for demo rigs.',
  },
  {
    id: 16,
    fname: 'Jessica',
    lname: 'Martinez',
    food: 'Stew',
    occupation: 'Recruiter',
    city: 'Phoenix',
    favoriteColor: 'Rose',
    hobby: 'Meditation',
    department: 'Talent',
    email: 'jessica.martinez@genseki.example',
    phone: '+1 (480) 555-4412',
    address: '400 E Van Buren St, Phoenix, AZ 85004',
    notes: 'Sorts by multiple columns while interviewing.',
  },
  {
    id: 17,
    fname: 'Daniel',
    lname: 'Robinson',
    food: 'Dumplings',
    occupation: 'Support Lead',
    city: 'Vancouver',
    favoriteColor: 'Cyan',
    hobby: 'Snowboarding',
    department: 'Support',
    email: 'daniel.robinson@genseki.example',
    phone: '+1 (604) 555-6006',
    address: '333 Seymour St, Vancouver, BC V6B 5A6',
    notes: 'Monitors SLA tables with grouped headers pinned.',
  },
  {
    id: 18,
    fname: 'Karen',
    lname: 'Clark',
    food: 'Schnitzel',
    occupation: 'BizOps Manager',
    city: 'Berlin',
    favoriteColor: 'Cream',
    hobby: 'Baking',
    department: 'BizOps',
    email: 'karen.clark@genseki.example',
    phone: '+49 30 555 880',
    address: 'Rudi-Dutschke-Strasse 26, 10969 Berlin',
    notes: 'Requests RTL pinning parity for global rollout.',
  },
  {
    id: 19,
    fname: 'Paul',
    lname: 'Rodriguez',
    food: 'Pizza',
    occupation: 'Customer Success',
    city: 'Miami',
    favoriteColor: 'Red',
    hobby: 'Fishing',
    department: 'Customer Success',
    email: 'paul.rodriguez@genseki.example',
    phone: '+1 (305) 555-0034',
    address: '100 NE 1st Ave, Miami, FL 33132',
    notes: 'Tracks health scores; requires persistent filter chips.',
  },
  {
    id: 20,
    fname: 'Nancy',
    lname: 'Lewis',
    food: 'Pancakes',
    occupation: 'Finance Analyst',
    city: 'Melbourne',
    favoriteColor: 'White',
    hobby: 'Pilates',
    department: 'Finance',
    email: 'nancy.lewis@genseki.example',
    phone: '+61 3 5556 1700',
    address: '80 Collins St, Melbourne VIC 3000',
    notes: 'Validates Excel parity; uses pinned subtotal columns.',
  },
  {
    id: 21,
    fname: 'Matthew',
    lname: 'Lee',
    food: 'Hot Dog',
    occupation: 'IT Lead',
    city: 'Los Angeles',
    favoriteColor: 'Silver',
    hobby: 'Surfing',
    department: 'IT',
    email: 'matthew.lee@genseki.example',
    phone: '+1 (213) 555-7710',
    address: '6121 Sunset Blvd, Los Angeles, CA 90028',
    notes: 'Needs telephone field masks when editing rows.',
  },
  {
    id: 22,
    fname: 'Michelle',
    lname: 'Walker',
    food: 'Waffles',
    occupation: 'Brand Strategist',
    city: 'Nashville',
    favoriteColor: 'Lilac',
    hobby: 'Songwriting',
    department: 'Brand',
    email: 'michelle.walker@genseki.example',
    phone: '+1 (615) 555-9092',
    address: '1200 Broadway, Nashville, TN 37203',
    notes: 'Pins creative brief columns; exports annotated PDFs.',
  },
  {
    id: 23,
    fname: 'Anthony',
    lname: 'Hall',
    food: 'Quiche',
    occupation: 'Security Eng',
    city: 'Houston',
    favoriteColor: 'Forest Green',
    hobby: 'Woodworking',
    department: 'Security',
    email: 'anthony.hall@genseki.example',
    phone: '+1 (713) 555-8811',
    address: '609 Main St, Houston, TX 77002',
    notes: 'Monitors incident queues; toggles column visibility daily.',
  },
  {
    id: 24,
    fname: 'Sarah',
    lname: 'Allen',
    food: 'Cake',
    occupation: 'Product Manager',
    city: 'Paris',
    favoriteColor: 'Gold',
    hobby: 'Painting',
    department: 'Product',
    email: 'sarah.allen@genseki.example',
    phone: '+33 1 55 55 9900',
    address: '16 Rue de Madrid, 75008 Paris',
    notes: 'Manages roadmap board; needs pinned roadmap status column.',
  },
  {
    id: 25,
    fname: 'Mark',
    lname: 'Young',
    food: 'Lasagna',
    occupation: 'CTO',
    city: 'San Francisco',
    favoriteColor: 'Blue',
    hobby: 'Cycling',
    department: 'Executive',
    email: 'mark.young@genseki.example',
    phone: '+1 (415) 555-0202',
    address: '140 New Montgomery St, San Francisco, CA 94105',
    notes: 'Walks investors through 4k monitor dashboards; stress test.',
  },
]

function BasicStickyColumnTable() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    getPaginationRowModel: getPaginationRowModel(),
    columns,
    state: {
      columnPinning: { left: ['id'] },
      pagination: { pageIndex: pageIndex, pageSize: pageSize },
    },
  })

  const firstLage = pageIndex === 0
  const lastPage = pageIndex === Math.ceil(users.length / pageSize) - 1

  return (
    <TanstackTableContainer>
      <TanstackTable table={table} />

      <PaginationBarContainer>
        <Pagination>
          <PaginationContent>
            <PaginationItem disabled={firstLage}>
              <PaginationPrevious onClick={(e) => setPageIndex((prev) => prev - 1)} />
            </PaginationItem>
            {[...Array(Math.ceil(users.length / pageSize)).keys()].map((index) => (
              <PaginationItem key={index} isActive={index === pageIndex}>
                <PaginationLink onClick={() => setPageIndex(index)} href="#">
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={lastPage}>
              <PaginationNext onClick={(e) => setPageIndex((prev) => prev + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex items-center gap-x-6">
          <PageIndex page={pageIndex + 1} totalPage={10} />
          <PageSizeSelect value={pageSize} onValueChange={setPageSize}>
            Per Page :{' '}
          </PageSizeSelect>
        </div>
      </PaginationBarContainer>
    </TanstackTableContainer>
  )
}

function TablePage() {
  return (
    <div className="grid min-h-[200dvh] justify-center items-start p-12">
      <BasicStickyColumnTable />
    </div>
  )
}
export default TablePage
