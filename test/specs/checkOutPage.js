const loginPage = require('../elements/login_Elements/elements')
const Gestures = require('../../commons/Gestures')
var assert = require('chai').assert
describe('结账页面',function(){
    var data = new Array();
    it('getCheckOutNum',function(){
        driver.pause(5000)
        driver.touchAction({action:'tap',x:194,y:168});
        const fromForPay = {x:251,y:580}
        const toForPay = {x:232,y:163}
        driver.pause(5000)
        Gestures.swipe(fromForPay,toForPay,100);
        driver.pause(5000)
        let ele = driver.findElements("xpath","//XCUIElementTypeOther//XCUIElementTypeStaticText[contains(@name,\"$\")]")
        
        let arr = Object.entries(ele)
        for(let i = 0;i < arr.length;i++){
            if(loginPage.payNum(i).indexOf("$") != -1){
                data.push(loginPage.payNum(i).replace('$ ',''))
                console.log('金额：'+data);
            }
        }
        assert.equal(arr.length,8,'金额数量已对上')
        console.log('金额：'+data);
    })
    it('testSubtotal',function(){
        console.log('test111'+data);
        assert.equal(data[0],'$30.00','小计')
    })
    it('testDiscount60%',function(){
        assert.equal(data[1],'-$19.00','折扣')

    })
    it('testPackFee',function(){
        assert.equal(data[2],'$1.00','包装费')
    })
    it('testMerchantServiceFee',function(){
        assert.equal(data[3],'$1.21','商家服务费')
    })
    it('testTax',function(){
        assert.equal(data[4],'$3.34','税')
    })
    it('testYamimealFee',function(){
        assert.equal(data[5],'$0.99','平台服务费')
    })
    it('testSurcharge',function(){
        assert.equal(data[6],'$1.00','配送费')
    })
    it('testTotal',function(){
        assert.equal(data[7],'$19.63','合计')
    })
})