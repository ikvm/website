<template>
  <div class="transferModal">
    <div class="row">
      <div class="col-xs-6">
        <b>资产类型：{{ deliver.name }}</b>
      </div>
      <div class="col-xs-6 text-right">
        <b>可用数量：{{ deliver.valid }}</b>
      </div>
    </div>

    <!-- 转账数量 -->
    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">映射数量：</span>
      <div class="col-xs-6">
        <input
            type="number" class="form-control" style="width:100%!important"
            v-model.number="amount.value"
            @keyup="checkAmount" @focus="selectAll" @blur="checkAmount" placeholder="整数数量">
      </div>
      <div class="col-xs-3">
        <span v-if="amount.wrong"
              class="error-text"> 数量错误 </span>
        <span v-else-if="amount.empty"
              class="error-text"> 数量不能为空 </span>
        <span v-else-if="amount.invalid"
              class="error-text"> 可用数量不足 </span>
        <span v-else-if="amount.lenErr"
              class="error-text"> 小数点后不能超过8位 </span>
        <span v-else-if="amount.success"> <img :src="yes"/> </span>
      </div>
    </div>

    <!-- 转账地址 -->
    <!-- <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">映射地址：</span>
      <div class="col-xs-6">
        <input type="text" class="form-control" style="width:100% !important;"
               v-model.trim="address.value"
               @focus="selectAll" >
      </div>
      <div class="col-xs-3">
        <span v-if="address.wrong"
              class="error-text"> 地址格式错误 </span>
        <span v-else-if="address.empty"
              class="error-text"> 地址不能为空 </span>
        <span v-else-if="address.lenErr"
              class="error-text"> 地址必须是34位 </span>
        <span v-else-if="address.success"> <img :src="yes"/> </span>
      </div>
    </div> -->

    <!-- 确认 -->
    <div class="row" style="margin-top:20px;">
      <div class="col-xs-3"></div>
      <div class="col-xs-6">
        <el-button type="primary" class="btn btn-block ljbutton" @click="transfer"
                   :loading="loading" :disabled="disabled">{{loading ? '执行中' : '确认'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import yes from '~images/yes.png'

  export default {
    data: () => ({
      disabled: true,
      amount: {
        value: '',
        empty: false,
        lenErr: false,
        wrong: false,
        invalid: false,
        success: false
      },
      address: {
        value: 'AFmseVrdL9f9oyCzZefL9tG6UbvhPbdYzM',
        empty: false,
        lenErr: false,
        wrong: false,
        success: false
      },
      success: false,
      loading: false,
      errors: {
        amountWrong: false,
        amountEmpty: false,
        amountInvalid: false,
        addWrong: false,
        addLenErr: false,
        addEmpty: false
      },
      yes
    }),

    methods: {
      transfer() {
        if (!this.checkAddress() || !this.checkAmount()) {
          this.$message.error('请仔细检查输入数量与地址！')
          return
        }
        if (Number(this.deliver.valid) < this.amount) {
          this.$message('余额不足！')
          return
        }

        this.loading = true
        this.$store.dispatch('TRANSFER', {
          dest: 'AFmseVrdL9f9oyCzZefL9tG6UbvhPbdYzM',
          amount: this.amount.value,
          assetId: this.deliver.assetId
        })
            .then(i => {
             
             // this.$message.success('转账成功！')
              // nep5
              if(this.deliver.assetId.length === 40 ){
                this.$message.success('映射已发起，请于1-2个高度后确认余额，期间请勿重复转账!')
              }else{
                this.$message.success('映射成功！')
              }


              this.$set(this.amount, 'value', '')
              this.$set(this.address, 'value', '')
              this.loading = false
              this.$emit('success')

              for (const i in this.address) {
                if (this.address.hasOwnProperty(i) && i !== 'value'){
                  this.address[i] = false
                }
              }
              for (const i in this.amount) {
                if (this.amount.hasOwnProperty(i) && i !== 'value'){
                  this.amount[i] = false
                }
              }
              this.disabled = true
            })
            .catch(e => {
              this.$message.error('映射失败，请不要在同一个高度连续映射！')
              this.loading = false
            })
      },

      checkAddress() {
        for (const i in this.address) {
          if (this.address.hasOwnProperty(i) && i !== 'value') this.address[i] = false
          this.address.success = false
        }

        if (this.address.value === '') this.address.empty = true
        if (!/^[a|A]/.test(this.address.value)) this.address.wrong = true
        if (this.address.value.length !== 34) this.address.lenErr = true

        for (const i in this.address) {
          if (this.address.hasOwnProperty(i) &&
              this.address[i] === true) return false
        }
        this.address.success = true
        if (this.amount.success && this.address.success) this.disabled = false
        return true
      },

      checkAmount() {
        this.disabled = true
        
        for (const i in this.amount) {
          if (this.amount.hasOwnProperty(i) && i !== 'value') this.amount[i] = false
          this.amount.success = false
        }

        const amountStr = String(this.amount.value)

        const reg = /^[1-9]\d*$/
        console.log('checkAmount',!reg.test(amountStr))
        if(!reg.test(amountStr)) this.amount.wrong = true

        if (Number(this.deliver.valid) < this.amount.value) this.amount.invalid = true
        if (amountStr.slice(amountStr.indexOf('.')).length > 9) this.amount.lenErr = true
        if (amountStr === '' || this.amount.value === 0) this.amount.empty = true
        if (!this.$_.isNumber(this.amount.value)) this.amount.wrong = true

        for (const i in this.amount) {
          if (this.amount.hasOwnProperty(i) &&
              this.amount[i] === true &&
              i !== 'value') return false
        }
        this.amount.success = true
        if (this.amount.success) this.disabled = false
        return true
      },

      selectAll(e) {
        setTimeout(function() {
          e.target.select()
        }, 0)
      }
    },

    computed: {
      ...mapGetters(['deliver'])
    },
    mounted() {
     // console.log('mounted')
     console.log('mounted',this.transferType)
    }
  }
</script>

<style lang="css">
  .transferModal {
    padding-left: 10px;
    padding-right: 20px
  }

  .error-text {

  }
</style>
