import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CFormInput } from '@coreui/react'

export default function SearchInput({
  searchAPI,
  searchParams,
  saveData,
  itemType,
  itemTypeIsVowel,
}) {
  const [searchString, setSearchString] = useState('')

  let searchDelayTimer
  useEffect(() => {
    clearTimeout(searchDelayTimer)
    searchDelayTimer = setTimeout(search, 500)
  }, [searchString])

  const search = async () => {
    const res = await searchAPI({ searchString, ...searchParams })
    saveData(res)
  }

  return (
    <CFormInput
      className="w-50"
      type="search"
      placeholder={itemType ? `Find a${itemTypeIsVowel ? 'n' : ''} ${itemType}` : 'Search'}
      aria-label="Search"
      value={searchString}
      onChange={(event) => setSearchString(event.target.value)}
    />
  )
}

SearchInput.propTypes = {
  searchAPI: PropTypes.any.isRequired,
  searchParams: PropTypes.object,
  saveData: PropTypes.func.isRequired,
  itemType: PropTypes.string,
  itemTypeIsVowel: PropTypes.bool,
}
