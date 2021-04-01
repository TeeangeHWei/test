const loginPage = require('../elements/login_Elements/elements')
describe('首次使用react app使用自动化测试',function(){
    it('login_case',function(){
        loginPage.clickGoogleBtn();
        driver.acceptAlert();
        driver.pause(2000)
        loginPage.clickGoogleUserBtn();
        driver.pause(2000)
        loginPage.clickDeliveryAddress();
        driver.pause(2000)
        loginPage.clickAccountBtn();
        driver.pause(5000)
        loginPage.getUserName();

    })
})