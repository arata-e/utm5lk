<template>
    <div>
    </div>
</template>

<script>
export default {
  mounted () {
    localStorage.removeItem('sid_customer')
    this.$cookie.delete('sid_customer')
    this.$router.push('/login')
  }
}
</script>
