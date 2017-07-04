function mixin (behaviour) {                                     
                                                                 
  let instanceKeys = Reflect.ownKeys(behaviour);                 
  let typeTag = Symbol('isa');                                   
                                                                 
  function _mixin (clazz) {                                      
                                                                 
    for (let property of instanceKeys){                          
                                                                 
        Object.defineProperty(clazz.prototype, property, {       
            value: behaviour[property],                          
            writable: true                                       
        });                                                      
    }                                                            
                                                                 
   Object.defineProperty(                                        
        clazz.prototype,                                         
        typeTag,                                                 
        { value: true }                                          
    );                                                           
                                                                 
    return clazz;                                                
  }                                                              
  Object.defineProperty(_mixin, Symbol.hasInstance, {            
    value: (i) => !!i[typeTag]                                   
  });                                                            
  return _mixin;                                                 
}                                                                
                                                                 
module.exports = mixin;
