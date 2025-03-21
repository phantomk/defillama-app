import * as React from 'react'
import { revalidate } from '~/api'
import { RAISES_API } from '~/constants'
import RaisesContainer from '~/containers/Raises'

export async function getStaticProps() {
	const data = await fetch(RAISES_API).then((r) => r.json())

	const investors = new Set<string>()

	data.raises.forEach((r) => {
		r.leadInvestors.forEach((x: string) => {
			investors.add(x.toLowerCase())
		})

		r.otherInvestors.forEach((x: string) => {
			investors.add(x.toLowerCase())
		})
	})

	return {
		props: {
			raises: data.raises.map((r) => ({
				...r,
				lead: r.leadInvestors.join(', '),
				otherInvestors: r.otherInvestors.join(', ')
			})),
			investors: Array.from(investors)
		},
		revalidate: revalidate()
	}
}

const Raises = ({ raises }) => {
	return <RaisesContainer raises={raises} investorName={null} />
}

export default Raises
