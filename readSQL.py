import sqlite3
import ast


connection = sqlite3.connect('participants.db')
cursor = connection.cursor()
cursor.execute("SELECT * FROM turkdemo") #turkdemo
results = cursor.fetchall()
map_str = lambda x: ','.join(map(str, x))

null=None
true=True
false=False

#output = []


header = ['worker_id','assignment_id','uniqueid','condition','pid','datetime',
            'trial_id','trial_phase','objs_remain',"obj_shape", "obj_color",
             'obj_size',  'obj_texture','obj_category',
            'money','potential_money','total_money', 'selected',
            'categories', 'objs', 'cplx','correct_guess', 'n_query','n_correct']
output = [map_str(header)]

t_num = 0
for r in results:
    print r
    #print r

    #try:
    #dic = eval(r[16].encode('ascii','ignore'))
    #dic = r[16].encode('ascii','ignore')
    #try:
    dic= eval(r[len(r)-1].encode('ascii', 'ignore'))
#except:
  #  pass
    if 'data' in dic:
        trial = dic['data'] 


        for t in trial:

            header = [x for x in t]
            tt = t['trialdata']
            print tt


            if tt['phase']=='TEST':
               # if 'debug' not in dic['workerId'] and "A19S8APZYIU1AC" not in dic["workerId"]:
                out = [dic['workerId'],dic['assignmentId'],
                     t['uniqueid'],tt['CONDITION'],tt['pid'],t['dateTime'],
                     tt['trial_id'],    tt['trial_phase'],tt['objs_remain'],tt["obj_shape"],
                     tt['obj_color'], tt['obj_size'],
                      tt['obj_texture'], tt['obj_category'],tt['money'],
                      tt['potential_money'], tt['total_money'], tt['selected'],
                      tt['categories'], tt['objs'],tt['cplx'], tt['correct_guess'],
                       tt['n_query'], tt['n_correct']]
                output.append(map_str(out))
                t_num += 1
    #except:
      #  print "FAIL"

   # except:
     #   print "didn't work"
      #  pass    

for o in output:
    print o
with open('data.csv','w') as f:
    f.write('\n'.join(output))
    f.close()
    
#with open('results/data.csv','w') as f:
   # f.write('\n'.join(output))
   # f.close()
    

