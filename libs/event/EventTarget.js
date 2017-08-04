//�Զ����¼����캯��
function EventTarget(){
  //�¼�����������鼯��
  this.handlers = {};
}
//�Զ����¼���ԭ�Ͷ���
EventTarget.prototype = {
  //����ԭ�͹��캯����
  constructor: EventTarget,
  //ע��������͵��¼��������
  //type -> �Զ����¼����ͣ� handler -> �Զ����¼��ص�����
  addEvent: function(type, handler){
    //�ж��¼����������Ƿ��и������¼�
    if(typeof this.handlers[type] == 'undefined'){
      this.handlers[type] = [];
    }
    //�������¼�push���¼�������������
    this.handlers[type].push(handler);
  },
  //����һ���¼�
  //event -> Ϊһ��js�������������ٰ���type���ԣ�
  //��Ϊ�����Ǳ���ģ���ο��Դ�һЩ��������Ҫ��������������������Ҳ��ΪʲôҪ��js�����ԭ��
  fireEvent: function(event){
    //ģ����ʵ�¼���event
    if(!event.target){
      event.target = this;
    }
    //�ж��Ƿ���ڸ��¼�����
    if(this.handlers[event.type] instanceof Array){
      var handlers = this.handlers[event.type];
      //��ͬһ���¼������µĿ��ܴ��ڶ��ִ����¼����ҳ�������Ҫ������¼�
      for(var i = 0; i < handlers.length; i++){
        //ִ�д���
        handlers[i](event);
      }
    }
  },
  //ע���¼�
  //type -> �Զ����¼����ͣ� handler -> �Զ����¼��ص�����
  removeEvent: function(type, handler){
    //�ж��Ƿ���ڸ��¼�����
    if(this.handlers[type] instanceof Array){
      var handlers = this.handlers[type];
      //��ͬһ���¼������µĿ��ܴ��ڶ��ִ����¼�
      for(var i = 0; i < handlers.length; i++){
        //�ҳ�������Ҫ������¼��±�
        if(handlers[i] == handler){
          break;
        }
      }
      //���¼�������������ɾ��
      handlers.splice(i, 1);
    }
  }
};