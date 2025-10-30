import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
const optionsAgency = [
  {
    name: 'buyer-commission-package',
    label: 'Buyer Commission Package',
    defaultChecked: true,
  },
  {
    name: 'buyer-voucher-package',
    label: 'Buyer Voucher Package',
    defaultChecked: true,
  },
  {
    name: 'agency-voucher-package',
    label: 'Agency Voucher Package',
    defaultChecked: true,
  },
]

const optionsBuyer = [
  {
    name: 'buyer-commission-package',
    label: 'Buyer Commission Package',
    defaultChecked: true,
  },
  {
    name: 'buyer-voucher-package',
    label: 'Buyer Voucher Package',
    defaultChecked: true,
  },
  {
    name: 'agency-voucher-package',
    label: 'Agency Voucher Package',
    defaultChecked: false,
  },
]

const optionsRuleAgency = [
  {
    name: 'balance',
    label: 'TBC Balance >= 1000 TBC',
    defaultChecked: true,
  },
  {
    name: 'package',
    label: 'Buyer Voucher Package >= 1000 TBC',
    defaultChecked: false,
  },
]

// const optionsRuleBuyer = [
//   {
//     name: "balance",
//     label: "TBC Balance >= 1000 TBC",
//     defaultChecked: false,
//   },
//   {
//     name: "package",
//     label: "Buyer Voucher Package >= 1000 TBC",
//     defaultChecked: true,
//   },
// ]

export default function UsersTemplate() {
  return (
    <div className='flex flex-col gap-4 px-4 lg:px-6'>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Card className='max-w-xs shadow-xs'>
          <CardHeader>
            <CardTitle>Agency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mt-2 flex flex-col items-start gap-4'>
              {optionsAgency.map(({ name, label, defaultChecked }) => (
                <div key={name} className='flex items-center gap-4'>
                  <Checkbox defaultChecked={defaultChecked} id={`${name}-vertical`} />
                  <label
                    htmlFor={`${name}-vertical`}
                    className='flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='max-w-xs shadow-xs'>
          <CardHeader>
            <CardTitle>Buyer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mt-2 flex flex-col items-start gap-4'>
              {optionsBuyer.map(({ name, label, defaultChecked }) => (
                <div key={name} className='flex items-center gap-4'>
                  <Checkbox defaultChecked={defaultChecked} id={`${name}-vertical`} />
                  <label
                    htmlFor={`${name}-vertical`}
                    className='flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <h2 className='mt-8 text-xl font-semibold'>How to become Agency ?</h2>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Card className='max-w-xs shadow-xs'>
          {/*<CardHeader>*/}
          {/*  <CardTitle>Agency</CardTitle>*/}
          {/*</CardHeader>*/}
          <CardContent>
            <div className='mt-2 flex flex-col items-start gap-4'>
              {optionsRuleAgency.map(({ name, label, defaultChecked }) => (
                <div key={name} className='flex items-center gap-4'>
                  <Checkbox defaultChecked={defaultChecked} id={`${name}-vertical`} />
                  <label
                    htmlFor={`${name}-vertical`}
                    className='flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
