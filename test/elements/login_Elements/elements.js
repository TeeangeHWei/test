var assert = require('chai').assert
class loginPage{
    eleWaitForDisplayed(ele,timeouts,msg){
        driver.waitUntil(()=>
        ele.isDisplayed() === true,
        {
            timeout:timeouts,
            timeoutMsg:msg
        })
    }
    payNum(index){
        let ele = $$('//XCUIElementTypeOther//XCUIElementTypeStaticText[contains(@name,\"$\")]')[index]
        var getAttributeNum = ele.getAttribute("value")
        return getAttributeNum
    }
    get googleLoginBtn(){
        const ele = '**/XCUIElementTypeOther[`label == "󰊭 Login with Google"`][1]'
        return $(`-ios class chain:${ele}`);
    }
    get googleUser(){
        const ele = '**/XCUIElementTypeOther[`label == "登入 - Google 帳戶"`]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]'

        return $(`-ios class chain:${ele}`)
    }
    get deliveryAddress(){
        const ele = '**/XCUIElementTypeOther[`label == " China, Guangdong Province, Zhongshan, Huoju Road, 中山火炬高技术产业开发区"`][2]'
        return $(`-ios class chain:${ele}`)
    }
    get accountTab(){
        const ele = '**/XCUIElementTypeButton[`label == "Account, tab, 4 of 4"`]'
        return $(`-ios class chain:${ele}`)
    }

    get userNameEle(){
        const ele = '**/XCUIElementTypeOther[`label == "123123 Profile "`]'
        return $(`-ios class chain:${ele}`)
    }

    getUserName(){
        try {
            this.eleWaitForDisplayed(this.userNameEle,5000,'点击tabbar账号按钮失败')
            var ss = this.userNameEle.getAttribute('name')
            console.log(ss);
        } catch (e) {
            assert.fail(`登录失败${e}`)
        }

    }

    clickAccountBtn(){
        try {
            this.eleWaitForDisplayed(this.accountTab,5000,'点击tabbar账号按钮失败')
            this.accountTab.click()
        } catch (e) {
            assert.fail(`登录失败${e}`)
        }
    }

    clickGoogleBtn(){
        this.googleLoginBtn.click()
    }
    clickGoogleUserBtn(){
        try {
            this.eleWaitForDisplayed(this.googleUser,5000,'点击登录谷歌账号登录失败');
            this.googleUser.click()
            
        } catch (e) {
            assert.fail(`登录失败${e}`)
        }
        
    }

    clickDeliveryAddress(){
        try {
            this.eleWaitForDisplayed(this.deliveryAddress,6000,'elements find timeout')
            this.deliveryAddress.click();
            
        } catch (e) {
            assert.fail(`登录失败${e}`)
        }
        
    }


}
module.exports = new loginPage()