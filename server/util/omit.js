function omit(obj, ...omit) {
  const result = { ...obj }
  omit.forEach(key => {
    delete result[key]
  })

  return result
}

export default omit
