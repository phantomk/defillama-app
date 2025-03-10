import * as React from 'react'
import { revalidate } from '~/api'
import { getInvestorsList } from '~/api/categories/raises'
import { RAISES_API } from '~/constants'
import RaisesContainer from '~/containers/Raises'
import { slug } from '~/utils'

export async function getStaticProps({
	params: {
		investor: [name]
	}
}) {
	const data = await fetch(RAISES_API).then((r) => r.json())

	const raises = []

	let investorName = null

	data.raises.forEach((r) => {
		let isInvestor = false

		r.leadInvestors.forEach((l) => {
			if (slug(l.toLowerCase()) === name) {
				investorName = l
				isInvestor = true
			}
		})

		r.otherInvestors.forEach((l) => {
			if (slug(l.toLowerCase()) === name) {
				investorName = l
				isInvestor = true
			}
		})

		if (isInvestor) {
			raises.push(r)
		}
	})

	if (raises.length === 0) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			raises: raises.map((r) => ({
				...r,
				lead: r.leadInvestors.join(', '),
				otherInvestors: r.otherInvestors.join(', ')
			})),
			investorName
		},
		revalidate: revalidate()
	}
}

export async function getStaticPaths() {
	const data = await fetch(RAISES_API).then((r) => r.json())

	const investors = getInvestorsList(data)

	return { paths: investors.map((i) => ({ params: { investor: [slug(i.toLowerCase())] } })), fallback: 'blocking' }
}

const Raises = ({ raises, investorName }) => {
	return <RaisesContainer raises={raises} investorName={investorName} />
}

export default Raises
