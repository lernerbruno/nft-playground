const Tijolo = artifacts.require("./Tijolo.sol");

contract('Tijolo', function(accounts) {
    it('set total supply after deployed', function() {
        return Tijolo.deployed().then(function(i) {
            tokenInstance = i;
            return tokenInstance.totalSupply();
        }).then( function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'Total Supply is 1 million');
        }
        )
    })
})