<template>
  <main class="p-16">
    <div class="w-full flex justify-center items-center flex-col gap-y-8">
      <h1
        class="text-6xl font-bold text-sky-500"
        :class="{ 'text-teal-500': account }"
      >
        {{ $t('hello', { name: 'Web 3!' }) }}
      </h1>

      <h2
        v-if="account"
        class="text-4xl text-center my-16 text-green-500 font-blod"
      >
        👋 {{ counts }}
      </h2>

      <button
        v-if="account"
        class="rounded-full py-4 px-8 text-2xl bg-teal-500 text-white"
        @click="handleSayHi"
      >
        <eos-icons:loading v-if="isLoading" />
        <span v-else>Say Hi</span>
      </button>

      <button
        v-else
        class="rounded-full py-4 px-8 text-2xl bg-sky-500 text-white"
        @click="handleConnectWallet"
      >
        Connect Wallet
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ethers } from 'ethers'

import { useAccountStore } from '@/stores/account'
import Counter from '../../artifacts/contracts/Counter.sol/Counter.json'
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const counterAbi = Counter.abi

const accountStore = useAccountStore()
const counts = ref(0)
const account = ref()
const isLoading = ref(false)

const checkIfWalletConnected = async () => {
  try {
    const { ethereum } = window as any

    if (ethereum) {
      console.log('metamask is available')
    } else {
      console.log('please install metamask')
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length > 0) {
      account.value = accounts[0]
      accountStore.setAccountState({
        account: accounts[0]
      })
      console.log(`found account with address ${account.value}`)
    } else {
      console.log('no account found')
    }
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const handleConnectWallet = async () => {
  try {
    const { ethereum } = window as any

    if (!ethereum) {
      throw new Error('no ethereum found')
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

    account.value = accounts[0]
    accountStore.setAccountState({
      account: accounts[0]
    })
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const getContract = () => {
  try {
    const { ethereum } = window as any

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, counterAbi, signer)

      return contract
    }
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const getCounts = async () => {
  const counterContract = getContract() as ethers.Contract
  counts.value = (await counterContract.getCounts()).toNumber()
}

const handleSayHi = async () => {
  const counterContract = getContract() as ethers.Contract

  isLoading.value = true

  const tx = await counterContract.increment()
  await tx.wait()
  await getCounts()

  isLoading.value = false
}

onMounted(() => {
  checkIfWalletConnected()
  getCounts()
})
</script>
